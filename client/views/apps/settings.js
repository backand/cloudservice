(function () {

  'use strict';
  angular.module('backand.apps')
    .controller('AppSettings', ['ConfirmationPopup', 'AppsService', '$state', 'NotificationService', AppSettings]);

  function AppSettings(ConfirmationPopup, AppsService, $state, NotificationService) {
    var self = this;

    (function init() {
      var appData = AppsService.currentApp;

      self.globalAppName = appData.Name;
      self.appName = appData.Name;
      self.appTitle = appData.Title;
      self.dateFormat = appData.settings.defaultDateFormat;
      self.datesFormar = ['MM/dd/yyyy', 'dd/MM/yyyy'];
      self.defaultPageSize = appData.settings.defaultPageSize;
    }());

    self.submitForm = function () {
      self.loading = true;
      var data = {
        Name: self.appName,
        Title: self.appTitle,
        settings: {
          defaultDateFormat: self.dateFormat,
          defaultPageSize: self.defaultPageSize
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
      ConfirmationPopup.confirm('Are you sure you want to delete the app?')
        .then(function (result) {
          if (!result)
            return;
          self.loading = true;
          AppsService.delete(self.globalAppName).then(deleteSuccess, errorHandler);
          $state.go('apps.index');
        })
    };

    function deleteSuccess() {
      NotificationService.add('success', 'The application was deleted');
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
    }
  }
}());
