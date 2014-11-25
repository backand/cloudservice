
(function  () {
    'use strict';
  angular.module('controllers')
    .controller('NavCtrl', ['$rootScope', '$scope', '$state', 'AppsService', NavCtrl]);

  function NavCtrl($rootScope, $scope, $state, AppsService){
    var self = this;

    this.appName = $state.params.name;
    this.app = null;

    function loadApp() {
      if (typeof self.appName !== 'undefined') {
        AppsService.getCurrentApp(self.appName)
          .then(function(data) {
            self.app = data;
          })
      }
    }

    $scope.$on('$stateChangeSuccess', function(){
      self.state = $state.current.name;
      self.appName = $state.params.name;
      loadApp();
    })


    this.getDBStatus = function() {
      if (self.app === null) {
        return 'unknown';
      }

      switch(parseInt(self.app.DatabaseStatus)) {
        case 0:
        case 2:
          return 'warning';
        case 1:
          return 'success';
        default:
          return 'error';

      }
    }

  }
}());
