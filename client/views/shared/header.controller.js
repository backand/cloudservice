(function () {
  'use strict';

  angular.module('controllers')
    .controller('HeaderController',
    ['$scope', 'AppsService', '$state', 'usSpinnerService', 'LayoutService', 'SessionService', '$location', '$modal','ModelService', HeaderController]);

  function HeaderController($scope, AppsService, $state, usSpinnerService, LayoutService, SessionService, $location, $modal, ModelService) {
    var self = this;
    self.usingDefaultModel = false;

    (function () {
      self.showJumbo = LayoutService.showJumbo();
    }());

    self.apps = AppsService.apps;
    self.currentAppName = AppsService.currentApp.Name;
    updateDefaultModelUse(self.currentAppName, false);

    $scope.$on('$stateChangeSuccess', function () {

      if( AppsService.currentApp === null ||
          AppsService.currentApp === undefined ||
          self.currentAppName === AppsService.currentApp.Name)
        return;

      self.currentAppName = AppsService.currentApp.Name;

      updateDefaultModelUse(self.currentAppName, false);
    });


    $scope.$on('fetchTables', function () {
      updateDefaultModelUse(self.currentAppName, true);
    });

    $scope.$on('appname:saved', function () {
      updateDefaultModelUse(self.currentAppName, true);
    });

    $scope.$on('AppDbReady', function () {
      updateDefaultModelUse(self.currentAppName, true);
    });

    function updateDefaultModelUse(appName, force){

      if(appName != undefined){
        ModelService.usingDefaultSchema(appName, force)
          .then(function(result){
            self.usingDefaultModel = result;
          });
      } else {
        self.usingDefaultModel = false;
      }
    }

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
      SessionService.clearCredentials();
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

    self.changePassword = function () {
      var modalInstance = $modal.open ({
        templateUrl: 'views/auth/change_password.html',
        controller: 'ChangePasswordController as ChangePassword'
      })
    }

  }


}());

