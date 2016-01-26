(function () {
  'use strict';
  angular.module('backand')
    .controller('HostingTreeController', ['AppsService', 'CONSTS', HostingTreeController]);

  function HostingTreeController(AppsService, CONSTS) {

    var self = this;

    self.appName = AppsService.currentApp.Name;
    self.hostingUrl = CONSTS.hostingUrl + '/' + self.appName;
  }

}());
