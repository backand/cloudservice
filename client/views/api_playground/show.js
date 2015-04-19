(function () {
  'use strict';

  angular.module('backand.playground')
    .controller('Playground', ["CONSTS", 'SessionService', '$state', 'usSpinnerService', '$sce', Playground]);

  function Playground(CONSTS, SessionService, $state, usSpinnerService, $sce) {
    var self = this;
    var token = SessionService.getToken();
    var appName = $state.params.appName;

    self.urlPrefix = function(){
      return $sce.trustAsHtml('<iframe id="restIfrmae" src="'
      + CONSTS.playgroundUrl
      + 'index.html?useToken=true" style="height:578px;width:100%;border: none"></iframe>');
    };

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
