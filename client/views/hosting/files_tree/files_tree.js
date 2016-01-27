(function () {
  'use strict';
  angular.module('backand')
    .controller('FilesTreeController', ['AppsService', 'CONSTS', FilesTreeController]);

  function FilesTreeController(AppsService, CONSTS) {

    var self = this;

    self.appName = AppsService.currentApp.Name;
    self.storageUrl = CONSTS.storageUrl + '/' + self.appName;
  }

}());
