(function () {
  'use strict';

  angular.module('backand')
    .controller('RestAPITab', ["CONSTS", 'SessionService', '$state', 'usSpinnerService', '$sce','ColumnsService','$scope', RestAPITab]);

  function RestAPITab(CONSTS, SessionService, $state, usSpinnerService, $sce, ColumnsService, $scope) {
    var self = this;
    var token = SessionService.getToken();
    var appName = $state.params.appName;

    self.urlPrefix = $sce.trustAsHtml('<iframe id="restIframe" src="'
        + CONSTS.playgroundUrl
        + 'index.html?tableName='+ ColumnsService.tableName + '&useToken=true&split=true#!/Objects" style="height:578px;width:100%;border: none"></iframe>');

    $scope.$on('$destroy', function () {
      // clear the iframe
      var iframe = angular.element('#restIframe');
      if (iframe && iframe.length > 0) {
        iframe[0].src = "javascript:;";
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
