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
      AppsService.getBackupVersions().then(function (data) {
        self.currentVersion = data.data.current;
        self.latestConfigurations = _.map(data.data.versions, function (value) {
          return {version: value};
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
        anchor.download = createFileName(version);
        anchor.href = downloadUrl;
        document.body.appendChild(anchor);
        anchor.click();
        usSpinnerService.stop('loading');
      });
    };

    function createFileName(version) {
      if (!version) {
        version = self.currentVersion;
      }
      return self.appName + "_" + version + ".zip";
    }
  }
}());
