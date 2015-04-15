(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('Docs', ['AppsService', 'usSpinnerService', Docs]);

  function Docs(AppsService, usSpinnerService) {

    var self = this;

    self.currentApp = AppsService.currentApp;
    usSpinnerService.spin("connecting-app-to-db");

    self.isNew = function () {
      var isNew = AppsService.currentApp && AppsService.currentApp.DatabaseStatus == 2;
      if (isNew) {
        usSpinnerService.spin("connecting-app-to-db");
      }
      else {
        usSpinnerService.stop("connecting-app-to-db");
      }
      return isNew;
    };
  }

}());
