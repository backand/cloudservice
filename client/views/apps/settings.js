(function () {

  'use strict';
  angular.module('backand.apps')
    .controller('AppSettings', ['$scope', 'ConfirmationPopup', 'AppsService', '$state', 'NotificationService', '$modal', 'usSpinnerService', AppSettings]);

  function AppSettings($scope, ConfirmationPopup, AppsService, $state, NotificationService, $modal, usSpinnerService) {
    var self = this;

    (function init() {
      var appData = AppsService.currentApp;

      self.globalAppName = appData.Name;
      self.appName = appData.Name;
      self.appTitle = appData.Title;
      self.dateFormat = appData.settings.defaultDateFormat;
      self.datesFormar = ['MM/dd/yyyy', 'dd/MM/yyyy'];
      self.defaultPageSize = appData.settings.defaultPageSize;
      self.defaultLevelOfDept = appData.settings.defaultLevelOfDept;
      self.config = appData.settings.config || '{\n\n\n}';
      self.debugMode = appData.debugMode;
    }());

    self.submitForm = function () {

      //check that config is a valid JSON
      try {
        var config = JSON.parse(self.config);
      } catch (err) {
        NotificationService.add('error', 'Config need to be properly formatted as JSON');
        self.loading = false;
        return;
      }

      self.loading = true;
      var data = {
        Name: self.appName,
        Title: self.appTitle,
        settings: {
          defaultDateFormat: self.dateFormat,
          defaultPageSize: self.defaultPageSize,
          defaultLevelOfDept: self.defaultLevelOfDept,
          config: self.config
        }
      };
      AppsService.update(self.globalAppName, data).then(submitSuccess, errorHandler);
      if (self.globalAppName != self.appName)
        $state.go('apps.index');
    };

    function submitSuccess() {
      NotificationService.add('success', 'Application settings updated successfully');
      self.loading = false;

      if (self.globalAppName != self.appName)
        $state.go('apps.index');
    }

    self.delete = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/apps/confirm_delete_app.html',
        controller: 'ConfirmDeleteApp as deleteApp',
        resolve: {
          appName: function () {
            return self.globalAppName;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if (!result)
          return;
        self.loading = true;
        usSpinnerService.spin('settings-loading');
        AppsService.delete(self.globalAppName).then(deleteSuccess, errorHandler);
        $state.go('apps.index', {deletedApp: self.globalAppName});
      });
    };

    self.reset = function () {
      ConfirmationPopup.confirm('Are you sure you want to clear the cache?')
        .then(function (result) {
          if (!result)
            return;
          self.loading = true;
          AppsService.reset(self.globalAppName).then(resetSuccess, errorHandler);
        })
    };

    self.debugModeUpdate = function () {
      AppsService.setDebug(self.debugMode).then(debugSuccess, errorHandler);
    };

    function debugSuccess(){
      $scope.$root.$broadcast('debugModeChange',self.debugMode);
    }

    self.ace = {
      onLoad: function (_editor) {
        self.ace.editor = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    var aceDefaulttext = {
      start: '/* globals\n\  $http - Service for AJAX calls \n' +
      '  CONSTS - CONSTS.apiUrl for Backands API URL\n' +
      '\*/\n' +
      '\'use strict\';\n' +
      'function backandCallback(userInput, dbRow, parameters, userProfile) {',
      end: '}'
    };

    function deleteSuccess() {
      NotificationService.add('success', 'The application was deleted');
      self.loading = false;
      usSpinnerService.stop('settings-loading');
    }
    function resetSuccess() {
      NotificationService.add('success', 'The cache was cleared');
      self.loading = false;
    }

    /**
     * delegate errors to the notification service
     * @param error
     * @param message
     */
    function errorHandler(error, message) {
      NotificationService.add('error', message);
      self.loading = false;
      usSpinnerService.stop('settings-loading');
    }
  }
}());
