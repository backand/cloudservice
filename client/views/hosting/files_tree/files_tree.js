(function () {
  'use strict';
  angular.module('backand')
    .controller('FilesTreeController', ['AppsService', FilesTreeController]);

  function FilesTreeController(AppsService) {

    var self = this;

    self.appName = AppsService.currentApp.Name;

  }

}());
