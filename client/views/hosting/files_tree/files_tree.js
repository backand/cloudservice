(function () {
  'use strict';
  angular.module('backand')
    .controller('FilesTreeController', ['AppsService', 'CONSTS', '$state', 'usSpinnerService', FilesTreeController]);

  function FilesTreeController(AppsService, CONSTS, $state, usSpinnerService) {

    var self = this;

    self.appName = AppsService.currentApp.Name;
    self.storageUrl = CONSTS.storageUrl + '/' + self.appName;

    self.refresh = function () {
      usSpinnerService.spin('loading');
      $state.go($state.current, {}, {reload: true}).then(function () {
        usSpinnerService.stop('loading');
      });
    };
  }

}());
