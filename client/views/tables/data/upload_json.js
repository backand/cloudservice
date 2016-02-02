(function () {

  angular.module('backand')
    .controller('UploadJsonController', [
      '$modalInstance',
      'tableName',
      '$scope',
      'DataService',
      'NotificationService',
      'usSpinnerService',
      UploadJsonController
    ]);

  function UploadJsonController($modalInstance, tableName, $scope, DataService, NotificationService, usSpinnerService) {
    var self = this;
    usSpinnerService.stop('upload-loading');

    $scope.$watch(function () {
      return self.file;
    }, function (file) {
      if (file) {
        console.log(file.name);
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

    function readFileFromInput(fileInput) {
      readTextFile(fileInput);
    }

    function readTextFile(file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var fileContent = reader.result;
        console.log(fileContent);
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
  }

}());
