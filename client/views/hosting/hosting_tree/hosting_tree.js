(function () {
  'use strict';
  angular.module('backand')
    .controller('HostingTreeController', ['AppsService',HostingTreeController]);

  function HostingTreeController(AppsService) {

    var self = this;

    self.appName = AppsService.currentApp.Name;

  }

}());
