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
    self.schemeFileName = tableName + '.json';

    $scope.$watch(function () {
      return self.file;
    }, function (file) {
      if (file) {
        readFileFromInput(file);
      }
    });

    self.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    self.upload = function (jsonData) {
      var data;
      if (self.jsonData) {
        // Get the data from the uploaded file
        if (self.jsonData.err) {
          NotificationService.add('error', self.jsonData.err);
          return;
        }
        data = self.jsonData.json;
      } else {
        // Get json from the editor
        data = getInlineJson(self.scheme);
        if (!data) {
          return;
        }
      }
      usSpinnerService.spin('upload-loading');
      DataService.bulkPost(tableName, data, true).then(function (result) {
        usSpinnerService.stop('upload-loading');
        $modalInstance.close({});
      });
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
        self.jsonData = getJsonFromFile(fileContent);
      };
      reader.readAsText(file);
    }

    function getInlineJson(json) {
      try {
        return JSON.parse(json);
      }
      catch (ex) {
        NotificationService.add('error', 'Invalid JSON');
        return null;
      }
    }

    function getJsonFromFile(fileContent) {
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
