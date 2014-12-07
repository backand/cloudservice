(function  () {
  'use strict';

  function HeaderController($scope, $rootScope, AppsService, $state, $stateParams) {
    var self = this;

    self.currAppName = '';

    this.redirectTo = function(appName) {
      if($state.current.name == 'apps.index')
          $state.current.name = 'apps.show';
      $state.go($state.current.name, { name: appName });
    };

    $scope.$on('$stateChangeSuccess', function() {
      AppsService.all()
        .then(function(data){
          self.apps = AppsService.appNames($state.params.name);
          self.currAppName = $state.params.name;
        });

    });
  }

  angular.module('controllers')
    .controller('HeaderController',
    ["$scope", '$rootScope', 'AppsService', '$state', '$stateParams', HeaderController]);

}());

