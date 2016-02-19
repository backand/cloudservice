(function () {

  'use strict';
  angular.module('backand.apps')
    .controller('AppConfiguration', ['AppsService', 'Upload', 'NotificationService', 'usSpinnerService', AppConfiguration]);

  function AppConfiguration(AppsService, Upload, NotificationService, usSpinnerService) {
    var self = this;
    self.appName = AppsService.currentApp.Name;

    init();

    function init() {
      usSpinnerService.spin('loading');
      self.currentVersion = '1.0.0';
      AppsService.getBackupVersions().then(function (data) {
        self.latestConfigurations = _.map(data.data.versions, function (value) {
          return {version: value, dateTime: new Date()};
        });
        usSpinnerService.stop('loading');
      });
    }

    self.uploadConfiguration = function (file) {
      usSpinnerService.spin('loading');
      Upload.dataUrl(file, true).then(function (dataUrl) {
        AppsService.uploadBackup(file.name, dataUrl.replace(/data.*base64,/g, '')).then(function (data) {
          AppsService.reset(self.appName).then(function (data) {
            init();
            NotificationService.add('success', 'Configuration imported successfully')
          });
        });
      })
    };

    self.setConfiguration = function (version) {
      usSpinnerService.spin('loading');
      AppsService.restoreBackup(version).then(function (data) {
        AppsService.reset(self.appName).then(function (data) {
          init();
          NotificationService.add('success', 'Configuration rolled to version ' + version + ' successfully')
        });
      });
    };

    self.downloadConfiguration = function (version) {
      usSpinnerService.spin('loading');
      AppsService.downloadBackup(version).then(function (data) {
        var blob = new Blob([data.data], {type: 'application/octet-stream'});
        var downloadUrl = (window.URL || window.webkitURL).createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = self.appName + ".zip";
        anchor.href = downloadUrl;
        anchor.click();
        usSpinnerService.stop('loading');
      });
    };
  }
}());
