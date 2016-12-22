(function () {
  'use strict';
  angular.module('backand')
    .controller('FilesTreeController', ['AppsService', 'CONSTS', '$state', 'usSpinnerService','$modal', FilesTreeController]);

  function FilesTreeController(AppsService, CONSTS, $state, usSpinnerService, $modal) {

    var self = this;

    self.appName = AppsService.currentApp.Name;
    self.storageUrl = CONSTS.storageUrl + '/' + self.appName;

    self.refresh = function () {
      usSpinnerService.spin('loading');
      $state.go($state.current, {}, {reload: true}).then(function () {
        usSpinnerService.stop('loading');
      });
    };

    self.upload = function () {

      var modalInstance = $modal.open({
        templateUrl: 'views/hosting/upload_files.html',
        controller: 'UploadFilesController as vm'
      });

      modalInstance.result.then(function (result) {
        if (result && result.reopen) {
          self.refresh();
        }
      });
    };
  }

}());
