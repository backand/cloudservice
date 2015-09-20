(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('Docs', ['AppsService', 'usSpinnerService', '$state', Docs]);

  function Docs(AppsService, usSpinnerService, $state) {

    var self = this;

    (function init() {
      usSpinnerService.spin("connecting-app-to-db");
      self.currentApp = AppsService.currentApp;
      if(self.currentApp.DatabaseStatus !== 0)
        AppsService.appKeys(self.currentApp.Name).then(setKeysInfo);

    }());

    function setKeysInfo(data){
      self.keys = data.data;
    }

    self.goToKickstart = function () {
      if (_.isEmpty(AppsService.currentApp)) {
        $state.go('docs.kickstart-open');
      }
      else {
        $state.go('docs.kickstart');
      }
    };

    self.goToQuickstart = function () {
      if (_.isEmpty(AppsService.currentApp)) {
        $state.go('docs.getting-started-open');
      }
      else {
        $state.go('docs.get-started');
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
