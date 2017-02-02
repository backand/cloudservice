(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('PlatformSelectController', ['AppsService', 'PlatformsService', '$state', '$rootScope', 'usSpinnerService', PlatformSelectController]);

  function PlatformSelectController(AppsService, PlatformsService, $state, $rootScope, usSpinnerService) {

    var self = this;

    (function init() {
      usSpinnerService.spin("connecting-app-to-db");
      self.platforms = PlatformsService.get();
      self.platforms = _.chunk(self.platforms, 4);
      self.isAppOpened = !_.isEmpty(AppsService.currentApp);
      self.currentApp = AppsService.currentApp;

      if($state.params.newApp && self.currentApp.DatabaseStatus == 1){
        $rootScope.$broadcast('AppDbReady', self.currentApp.Name);
      }
    }());

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

    self.choosePlatform = function (starterAppId) {
      var state = ($state.current.parent == "apps" ? "docs.starter_app_select-open" : "docs.starter_app_select");
      $state.go(state, {starterAppId: starterAppId, mode:$state.params.mode, newApp: $state.params.newApp});
    }
  }
}());
