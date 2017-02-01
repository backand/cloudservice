(function () {
  'use strict';

  angular.module('backand.apps')
    .controller('StarterAppSelectController', ['KickstartService', 'PlatformsService', '$state','AppsService','usSpinnerService','$modal', StarterAppSelectController]);

  function StarterAppSelectController(KickstartService, PlatformsService, $state, AppsService, usSpinnerService, $modal) {

    var self = this;

    (function init() {
      usSpinnerService.spin("connecting-app-to-db");
      self.platforms = PlatformsService.get();
      self.selectedPlatform = $state.params.starterAppId || 'ng1';
      self.selectedMode = $state.params.mode;

      self.templateUrl = KickstartService.getPlatformContent(self.selectedPlatform + "_" + self.selectedMode);
      self.isAppOpened = !_.isEmpty(AppsService.currentApp);
      self.currentApp = AppsService.currentApp;
      if(self.currentApp.DatabaseStatus !== 0 && !_.isEmpty(AppsService.currentApp))
        AppsService.appKeys(self.currentApp.Name).then(setKeysInfo);

    }());

    function setKeysInfo(data){
      self.keys = data.data;
      self.masterToken = data.data.general;
    }

    self.changePlatform = function (starterAppId) {
      self.selectedPlatform = starterAppId;
      self.templateUrl = KickstartService.getPlatformContent(self.selectedPlatform + "_" + self.selectedMode);
    };

    self.goToExisting = function() {
      $state.go('docs.platform_select_existing');
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

    self.newApp = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/docs/new_app_modal.html',
        controller: 'NewAppModalController',
        controllerAs: 'newAppModal'
      });
    };


    self.goToKickstart = function () {
      $state.go('docs.platform_select_kickstart');
    };
  }
}());
