(function () {
  'use strict';

  angular.module('controllers')
    .controller('HeaderController',
    ['$scope', 'AppsService', '$state', 'usSpinnerService', 'LayoutService', 'SessionService', '$location', '$modal', 'ModelService','SocketService', HeaderController]);

  function HeaderController($scope, AppsService, $state, usSpinnerService, LayoutService, SessionService, $location, $modal, ModelService, SocketService) {
    var self = this;
    self.usingDefaultModel = false;
    self.showParseMigrationTool = $state.current.name == 'apps.index' || $state.current.name == 'apps.parse';

    (function () {
      self.showJumbo = LayoutService.showJumbo();
    }());

    self.apps = AppsService.apps;
    self.currentAppName = AppsService.currentApp.Name;
    self.debugMode = AppsService.currentApp.debugMode;
    //when app change login to the socket
      SocketService.login(self.currentAppName);
    updateDefaultModelUse(self.currentAppName, false);

    $scope.$on('$stateChangeSuccess', function () {

      if ($state.current.name == 'apps.parse') {
        self.openParseMigrationTool();
      }

      if (AppsService.currentApp === null ||
        AppsService.currentApp === undefined ||
        self.currentAppName === AppsService.currentApp.Name)
        return;

      self.currentAppName = AppsService.currentApp.Name;

      self.showParseMigrationTool = $state.current.name == 'apps.index' || $state.current.name == 'apps.parse';
      self.debugMode = AppsService.currentApp.debugMode;

      updateDefaultModelUse(self.currentAppName, false);
    });

    $scope.$on('debugModeChange', function (fun, mode) {
      self.debugMode = mode;
    });

    $scope.$on('fetchTables', function () {
      updateDefaultModelUse(self.currentAppName, true);

      //when app change login to the socket
      SocketService.login(self.currentAppName);
    });

    $scope.$on('appname:saved', function () {
      updateDefaultModelUse(self.currentAppName, true);
    });

    $scope.$on('AppDbReady', function () {
      updateDefaultModelUse(self.currentAppName, true);
    });

    function updateDefaultModelUse(appName, force) {

      if (appName != undefined) {
        ModelService.usingDefaultSchema(appName, force)
          .then(function (result) {
            self.usingDefaultModel = result;
          });
      } else {
        self.usingDefaultModel = false;
      }
    }

    self.goToApp = function () {
      usSpinnerService.spin('loading-app');
      $state.go('app', {appName: self.currentAppName}, {reload: true});
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
      var modalInstance = $modal.open({
        templateUrl: 'views/auth/change_password.html',
        controller: 'ChangePasswordController as ChangePassword'
      })
    };

    self.openParseMigrationTool = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/shared/parse_migration.html',
        controller: 'ParseMigrationController as parseMigration'
      });
      modalInstance.result.then(function (result) {
        if (result.success) {
          var successModal = $modal.open({
            templateUrl: 'views/shared/parse_migration_success.html',
            controller: 'ParseSuccessController as parseSuccess'
          });
          successModal.result.then(goBackToIndex, goBackToIndex);
        } else {
          $state.go('apps.index');
        }
      },
        goBackToIndex);
    };

    self.initMigrationModal = function () {
      self.openParseMigrationTool();
    };

    self.deleteAccount = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/auth/delete_account.html',
        controller: 'DeleteAccountController as deleteAccount'
      })
    };

    function goBackToIndex() {
      $state.go('apps.index');
    }


  }


}());

