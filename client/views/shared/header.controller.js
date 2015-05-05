(function () {
  'use strict';

  angular.module('controllers')
    .controller('HeaderController',
    ["$scope", 'AppsService', '$state', 'usSpinnerService', 'LayoutService', 'SessionService', '$location', '$modal', HeaderController]);

  function HeaderController($scope, AppsService, $state, usSpinnerService, LayoutService, SessionService, $location, $modal) {
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

    self.openVideoModal = function () {
      $modal.open({
        templateUrl: 'views/shared/video_tutorials.html',
        windowTemplateUrl: 'views/shared/video_tutorials_window.html',
        controller: 'VideoController as videoCtrl',
        backdropClass: 'video-bg'
      })
    };

    self.closeVideoModal = function () {
      self.showVideoModal = false;
    };

  }


}());

