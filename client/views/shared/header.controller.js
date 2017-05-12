(function () {
  'use strict';

  angular.module('controllers')
    .controller('HeaderController',
    ['$scope', '$http', 'AppsService', '$state', 'usSpinnerService', 'LayoutService', 'SessionService', '$location', '$modal', 'ModelService','SocketService','DbDataModel','$localStorage', HeaderController]);

  function HeaderController($scope, $http, AppsService, $state, usSpinnerService, LayoutService, SessionService, $location, $modal, ModelService, SocketService, DbDataModel, $localStorage) {
    var self = this;
    self.usingDefaultModel = false;
    self.showParseMigrationTool = $state.current.name == 'apps.index' || $state.current.name == 'apps.parse';
    self.apps = AppsService.apps;
    self.currentState = $state.current.name;
    self.app = AppsService.currentApp;
    self.currentAppName = AppsService.currentApp.Name;
    self.debugMode = AppsService.currentApp.debugMode;
    self.backandstorage = $localStorage.backand[self.app.Name];

    (function () {
      self.showJumbo = LayoutService.showJumbo();
      self.showIntercom = LayoutService.loadShowIntercomConfig();
      displayStatus();
      updateDefaultModelUse(self.currentAppName, false);
    }());

    $scope.$on('nav.secondAppNavChoice', function(){
      self.isDatabase = (self.backandstorage.secondAppNavChoice === 'database');
    });

    $scope.$on('$stateChangeSuccess', function () {

      if ($state.current.name == 'apps.parse') {
        self.openParseMigrationTool();
      }

      self.showParseMigrationTool = $state.current.name == 'apps.index' || $state.current.name == 'apps.parse';

      updateDefaultModelUse((AppsService.currentApp ? AppsService.currentApp.Name : undefined), false);

      if(AppsService.currentApp !== undefined && AppsService.currentApp !== null) {
        //when app change login to the socket
        SocketService.login(AppsService.currentApp.Name);
      }

      if (AppsService.currentApp === null ||
        AppsService.currentApp === undefined ||
        self.currentAppName === AppsService.currentApp.Name)
        return;

      self.currentAppName = AppsService.currentApp.Name;
      self.debugMode = AppsService.currentApp.debugMode;


      if(self.currentAppName) {
        //clear the model
        DbDataModel.get(self.currentAppName, true);
      }

    });

    $scope.$on('debugModeChange', function (fun, mode) {
      self.debugMode = mode;
    });

    $scope.$on('fetchTables', function () {
      updateDefaultModelUse(self.currentAppName, true);

      //when app change login to the socket
      if(self.currentAppName) {
        SocketService.login(self.currentAppName);

        //clear the model
        DbDataModel.get(self.currentAppName, true);
      }
    });
    $scope.$on('database-change', function(){
      updateDefaultModelUse(self.currentAppName, true);
    });
    $scope.$on('database-undo', function(){
      self.usingDefaultModel = false;
    });
    $scope.$on('appname:saved', function () {
      updateDefaultModelUse(self.currentAppName, true);
    });

    $scope.$on('AppDbReady', function () {
      updateDefaultModelUse(self.currentAppName, true);
    });

    $scope.$watch(function () {
      return self.showIntercom;
    }, function (newVal, oldVal) {
      newVal ? self.showIntercomLabel = 'Hide Intercom Icon' : self.showIntercomLabel = "Show Intercom Icon";
    });

    function updateDefaultModelUse(appName, force) {

      if (self.backandstorage && self.backandstorage.secondAppNavChoice === 'database' && appName !== undefined) {
        ModelService.usingDefaultSchema(appName, force)
          .then(function (result) {
            if(result) {
              self.usingDefaultModel = result;
            }
            if(result === false){
              self.usingDefaultModel = false;
            }
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
      return $state.current.name === 'apps.index';
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

    self.openPaymentMethod = function(){
      $modal.open({
        templateUrl: 'views/apps/billing_portal.html',
        controller: 'BillingPortalController as vm'
      });
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
      });
    };

    self.toggleIntercom = function () {
      self.showIntercom = LayoutService.toggleIntercomIconVisibility();
    };

    self.hideDropdowns = function () {
      self.showUserDropdown = false;
      self.showHelpDropdown = false;
    };

    self.toggleUserDropdown = function ($event) {
      self.showUserDropdown = !self.showUserDropdown;
      self.showHelpDropdown = false;
      $event.stopPropagation();
    };

    self.toggleHelpDropdown = function ($event) {
      self.showHelpDropdown = !self.showHelpDropdown;
      self.showUserDropdown = false;
      $event.stopPropagation();
    };

    function goBackToIndex() {
      $state.go('apps.index');
    }

    function displayStatus(){
      var statusAPI = "https://api.status.io/1.0/status/57f4ccbf9d490a4723000a05";
      var maxStatusCode = "";
      var maxStatusDescription = "";
      var sc = "";
      var sd = "";

      $http.get(statusAPI).then(function(results){
        var data = results.data;
        angular.forEach(data.result.status, function(s){
          angular.forEach(s.containers, function(c){
            sc = c.status_code;
            sd = c.status;
            if (maxStatusCode < sc){
              maxStatusCode = sc;
              maxStatusDescription = sd;
            }
          })
        });

        if (maxStatusCode === ""){
          return;
        }

        self.currentStatus = "Current System Status: ";
        // Operational
        if (maxStatusCode === 100){
          angular.element(".current-status-indicator").addClass("green");
          self.currentStatus += maxStatusDescription;
          //$("#current-status-description").text(maxStatusDescription);
        }
        // Scheduled Maintenance
        if (maxStatusCode === 200){
          angular.element(".current-status-indicator").addClass("blue");
          self.currentStatus += maxStatusDescription;
        }
        // Degraded Performance || Partial Outage
        if (maxStatusCode === 300 || maxStatusCode === 400){
          angular.element(".current-status-indicator").addClass("yellow");
          self.currentStatus += maxStatusDescription;
        }
        // Service Disrtuption || Security Issue
        if (maxStatusCode === 500 || maxStatusCode === 600){
          angular.element(".current-status-indicator").addClass("red");
          self.currentStatus += maxStatusDescription;
        }


      })

    }


  }


}());

