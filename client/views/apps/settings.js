(function () {

  'use strict';
  angular.module('app.apps')
    .controller('AppSettings', ['$scope', 'ConfirmationPopup', 'appItem', 'AppsService', '$state', 'NotificationService', AppSettings]);

  function AppSettings($scope, ConfirmationPopup, appItem, AppsService, $state, NotificationService) {
    var self = this;

    (function init() {
      self.appName = $state.params.name;
      var appData = appItem.data;

      AppsService.setCurrentApp(appItem.data);
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
    }

    function submitSuccess() {
      NotificationService.add('success', 'Application settings updated successfully');
      self.loading = false;

      if (self.globalAppName != self.appName)
        $state.go('apps.index', {name: ''});
    }

    self.delete = function () {
      ConfirmationPopup.confirm('Are you sure you want to delete the app?')
        .then(function (result) {
          if (!result)
            return;
          AppsService.delete(self.globalAppName).then(deleteSuccess, errorHandler);
          $state.go('apps.index', {name: ''});
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
