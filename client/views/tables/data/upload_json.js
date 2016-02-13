(function () {

  angular.module('backand')
    .controller('UploadJsonController', [
      '$modalInstance',
      'tableName',
      'columns',
      '$scope',
      'DataService',
      'NotificationService',
      'usSpinnerService',
      'AppsService',
      UploadJsonController
    ]);

  function UploadJsonController($modalInstance, tableName, columns, $scope, DataService, NotificationService, usSpinnerService, AppsService) {
    var self = this;
    self.scheme = getJsonScheme();
    initDownloadJsonScheme();
    self.appName = AppsService.currentApp.Name;
    self.schemeFileName = self.appName + '.json';

    $scope.$watch(function () {
      return self.file;
    }, function (file) {
      if (file) {
        readFileFromInput(file);
      }
    });

    self.upload = function () {
      if (self.jsonData.err) {
        NotificationService.add('error', self.jsonData.err);
        return;
      }
      usSpinnerService.spin('upload-loading');
      DataService.bulkPost(tableName, self.jsonData.json, true).then(function (result) {
        usSpinnerService.stop('upload-loading');
        $modalInstance.close({});
      });
    };

    self.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    function initDownloadJsonScheme() {
      var blob = new Blob([self.scheme], {type: 'text/plain'});
      self.jsonDownloadUrl = (window.URL || window.webkitURL).createObjectURL(blob);
    }

    function readFileFromInput(fileInput) {
      readTextFile(fileInput);
    }

    function readTextFile(file) {
      var reader = new FileReader();
      usSpinnerService.spin('upload-loading');
      reader.onload = function (e) {
        usSpinnerService.stop('upload-loading');
        var fileContent = reader.result;
        self.jsonData = getJson(fileContent);
      };
      reader.readAsText(file);
    }

    function getJson(fileContent) {
      var maxDocuments = 1000;
      try {
        var json = JSON.parse(fileContent);
        if (Array.isArray(json)) {
          if (json.length > maxDocuments) {
            return {
              err: "Too much documents in file.",
              json: null
            };
          }
          return {
            err: null,
            json: json
          };
        }
        return {
          err: null,
          json: [json]
        };
      }
      catch (ex) {
        return {
          err: "Invalid json file.",
          json: null
        };
      }
    }

    function getJsonScheme() {
      var schemeToReturn = [];
      schemeToReturn.push({});
      columns.forEach(function (field) {
        if (!field.disable && !field.hide) {
          schemeToReturn[0][field.key] = field.value;
        }
      });
      return JSON.stringify(schemeToReturn, null, 2);
    }
  }

}());
