(function () {
  'use strict';

  angular.module('app.playground')
    .controller('Playground', ["CONSTS", 'SessionService', '$state', 'usSpinnerService','$scope','$sce', Playground]);

  function Playground(CONSTS, SessionService, $state, usSpinnerService,$scope, $sce) {
    var self = this;
    var token = SessionService.getToken();
    var appName = $state.params.name;

    self.urlPrefix = function(){
      var isRest = $state.$current.url.prefix.indexOf('/rest/') > -1;
      if(isRest){
        return $sce.trustAsHtml('<iframe id="restIfrmae" src="' + CONSTS.playgroundUrl + 'index.html?useToken=true#!/Database_Table_Data" style="height:578px;width:1028px;border: none"></iframe>');
      }
      else{
        return $sce.trustAsHtml('<iframe id="restIfrmae" src="' + CONSTS.playgroundUrl + 'index.html?useToken=true&orm=restangular#!/Database_Table_Data" style="height:578px;width:1028px;border: none"></iframe>');
      }
    }

    window.addEventListener('message', function (e) {
      var eventName = e.data[0];
      var data = e.data[1];
      switch (eventName) {
        case 'setHeight':
          $("#restIfrmae").height(data + 50);
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
