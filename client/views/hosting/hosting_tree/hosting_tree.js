(function () {
  'use strict';
  angular.module('backand')
    .controller('HostingTreeController', ['AppsService', 'CONSTS', '$state', 'usSpinnerService', HostingTreeController]);

  function HostingTreeController(AppsService, CONSTS, $state, usSpinnerService) {

    var self = this;

    self.appName = AppsService.currentApp.Name;
    self.hostingUrl = CONSTS.hostingUrl + '/' + self.appName;

    self.refresh = function () {
      usSpinnerService.spin('loading');
      $state.go($state.current, {}, {reload: true}).then(function () {
        usSpinnerService.stop('loading');
      });
    };
  }

}());
