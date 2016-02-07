(function () {

  'use strict';
  angular.module('backand.apps')
    .controller('AppConfiguration', ['AppsService', 'CONSTS', 'SessionService', '$cookies', '$http', AppConfiguration]);

  function AppConfiguration(AppsService) {
    var self = this;
    self.appName = AppsService.currentApp.Name;

    (function init() {
      AppsService.getBackupVersions().then(function (data) {
        self.latestConfigurations = _.map(data.data.versions, function (value) {
          return {version: value, dateTime: new Date()};
        });
      });
    }());

    self.uploadConfiguration = function (file) {
      AppsService.uploadBackup(file.name, file);
    };

    self.setConfiguration = function (version) {
      AppsService.restoreBackup(version).then(function (data) {
        init();
      });
    };

    self.downloadConfiguration = function (version) {
      AppsService.downloadBackup(version).then(function (data, status, headers) {
        var blob = new Blob([data.data], {type: 'application/octet-stream'});
        var downloadUrl = (window.URL || window.webkitURL).createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = self.appName + ".zip";
        anchor.href = downloadUrl;
        anchor.click();
      });
    };
  }
}());
