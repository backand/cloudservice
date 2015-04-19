(function () {
  'use strict';

  angular.module('backand.playground')
    .controller('Playground', ["CONSTS", 'SessionService', '$state', 'usSpinnerService', '$sce', '$scope', Playground]);

  function Playground(CONSTS, SessionService, $state, usSpinnerService, $sce, $scope) {
    var self = this;
    var token = SessionService.getToken();
    var appName = $state.params.appName;

    self.urlPrefix = $sce.trustAsHtml('<iframe id="restIfrmae" src="'
      + CONSTS.playgroundUrl
      + 'index.html?useToken=true" style="height:578px;width:100%;border: none"></iframe>');
    
    $scope.$on('$destroy', function () {
        // Make sure that the interval is destroyed too
        var iframe = angular.element('#restIfrmae');
        if (iframe && iframe.length > 0) {
            iframe[0].src = "javascript:void";
        }
    });


    window.addEventListener('message', function (e) {
      var eventName = e.data[0];
      var data = e.data[1];
      switch (eventName) {
        case 'setHeight':
          $("#restIframe").height(data + 50);
          break;
        case 'ready':
          var o = document.getElementsByTagName('iframe')[0];
          usSpinnerService.spin("loading");

          var message = {auth: 'bearer ' + token, appName: appName};
          o.contentWindow.postMessage(message, "*");
          break;
        case 'complete':
          usSpinnerService.stop("loading");
          break;
      }
    }, false);
  }


}());
