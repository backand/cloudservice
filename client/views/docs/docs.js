(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('Docs', ['AppsService', 'usSpinnerService', '$state', Docs]);

  function Docs(AppsService, usSpinnerService, $state) {

    var self = this;

    self.currentApp = AppsService.currentApp;
    usSpinnerService.spin("connecting-app-to-db");

    self.goToKickstart = function () {
      if (_.isEmpty(AppsService.currentApp)) {
        $state.go('docs.kickstart-open');
      }
      else {
        $state.go('docs.kickstart');
      }
    };

    self.isNew = function () {
      var isNew = !_.isEmpty(AppsService.currentApp) && AppsService.currentApp.DatabaseStatus == 2;
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
