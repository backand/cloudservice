(function () {
  'use strict';

  angular.module('controllers')
    .controller('HeaderController',
    ["$scope", 'AppsService', '$state', 'usSpinnerService', 'LayoutService', 'SessionService', '$location', HeaderController]);

  function HeaderController($scope, AppsService, $state, usSpinnerService, LayoutService, SessionService, $location) {
    var self = this;

    (function () {
      self.showJumbo = LayoutService.showJumbo();
    }());

    self.apps = AppsService.apps;
    self.currentAppName = AppsService.currentApp.Name;

    $scope.$on('$stateChangeSuccess', function () {
      self.currentAppName = AppsService.currentApp.Name;
    });

    self.goToApp = function () {
      usSpinnerService.spin('loading-app');
      $state.go('app', {appName: self.currentAppName});
    };

    self.hideAppList = function () {
      return $state.current.name === 'apps.index' && self.showJumbo;
    };

    self.getCurrentUser = function () {
      return SessionService.currentUser;
    };

    self.logout = function () {
      SessionService.ClearCredentials();
      $location.path("/sign_in")
    };
  }


}());

