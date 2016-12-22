(function () {

  angular.module('backand')
    .controller('UploadFilesController', [
      '$modalInstance',
      'Upload',
      'usSpinnerService',
      'FilesService',
      'AppsService',
      UploadFilesController
    ]);

  function UploadFilesController($modalInstance, Upload, usSpinnerService, FilesService, AppsService) {
    var self = this;

    self.appName = AppsService.currentApp.Name;

    self.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    self.upload = function () {
      var files = self.files;
      if (files && files.length) {
        var c = files.length;
        usSpinnerService.spin('upload-loading');
        Upload.base64DataUrl(files).then(function(base64Urls) {
          for (var i = 0; i < base64Urls.length; i++) {
            var fileData = base64Urls[i];
            var fileName = files[i].name;

            FilesService.upload(fileName, fileData, self.appName)
            .then(function(res) {
              console.log(res.data.url);
            }, function(err){
              console.log(err.data);
            }).finally(function() {
              c--;
              if(c===0){
                usSpinnerService.stop('upload-loading');
                $modalInstance.close({});
              }
            });
          }
        });

      }
    };

  }

}());
