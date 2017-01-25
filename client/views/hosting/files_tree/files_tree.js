(function () {
  'use strict';
  angular.module('backand')
    .controller('FilesTreeController', ['AppsService', 'CONSTS', '$state', 'usSpinnerService','$modal','$window', FilesTreeController]);

  function FilesTreeController(AppsService, CONSTS, $state, usSpinnerService, $modal, $window) {

    var self = this;
    self.actions = ['Download','Delete'];
    self.node = null;

    self.appName = AppsService.currentApp.Name;
    self.storageUrl = CONSTS.storageUrl + '/' + self.appName;

    self.refresh = function () {
      usSpinnerService.spin('loading');
      $state.go($state.current, {}, {reload: true}).then(function () {
        usSpinnerService.stop('loading');
      });
    };

    self.selected = function(node){
      self.node = node;
    };

    self.runAction = function(){
      //self.action = null;
    };

    self.upload = function () {

      var modalInstance = $modal.open({
        templateUrl: 'views/hosting/upload_files.html',
        controller: 'UploadFilesController as vm'
      });

      modalInstance.result.then(function (result) {
        if (result) {
          self.refresh();
        }
      });
    };
  }

}());
