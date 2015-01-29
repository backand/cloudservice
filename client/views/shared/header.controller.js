(function () {
  'use strict';

  function HeaderController($scope, AppsService, $state, $stateParams) {
    var self = this;

    self.currAppName = '';

    this.redirectTo = function (appName) {
      $state.go('apps.show', {name: appName})
    };

    this.goTo = function (state) {
      $state.go(state, {name: ''});
    };

    $scope.$on('$stateChangeSuccess', function () {
      AppsService.all()
        .then(function (data) {
          self.apps = AppsService.appNames($state.params.name);
          self.currAppName = $state.params.name;
        });
    });
  }

  angular.module('controllers')
    .controller('HeaderController',
    ["$scope", 'AppsService', '$state', '$stateParams', HeaderController]);

}());

