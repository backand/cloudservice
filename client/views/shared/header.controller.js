(function  () {
  'use strict';

  function HeaderController($scope, $rootScope, AppsService, $state, $stateParams) {
    var self = this;

    self.currAppName = '';

    AppsService.all()
      .then(function(data){
        self.apps=AppsService.appNames();
        self.currAppName = $state.params.name;
      },function(err){

      });

    this.redirectTo = function(appName) {
      $state.go('apps.show',{ name: appName });
    };

    $scope.$on('$stateChangeSuccess', function() {
      if (self.apps){
        self.currAppName = $state.params.name;
      }

    });
  }

  angular.module('controllers')
    .controller('HeaderController',
    ["$scope", '$rootScope', 'AppsService', '$state', '$stateParams', HeaderController]);

}());

