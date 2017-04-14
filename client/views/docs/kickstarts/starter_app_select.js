(function () {
  'use strict';

  angular.module('backand.apps')
    .controller('StarterAppSelectController', ['KickstartService', 'PlatformsService', '$state','AppsService','usSpinnerService','$modal', 'LocalStorageService','AnalyticsService', StarterAppSelectController]);

  function StarterAppSelectController(KickstartService, PlatformsService, $state, AppsService, usSpinnerService, $modal, LocalStorageService,AnalyticsService) {

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

    self.storage = LocalStorageService.getLocalStorage();

    self.changePlatform = function (starterAppId) {
      switch (starterAppId) {
        case 'ng1':
          self.storage.docLanguage = 1;
          self.storage.favoriteLanguage = 1;
          break;
        case 'ng2':
          self.storage.docLanguage = 2
          self.storage.favoriteLanguage = 2;
          break;
        case 'ionic1':
          self.storage.docLanguage = 3
          self.storage.favoriteLanguage = 3;
          break;
        case 'ionic2':
          self.storage.docLanguage = 4
          self.storage.favoriteLanguage = 4;
          break;
        case 'redux':
          self.storage.docLanguage = 5
          self.storage.favoriteLanguage = 5;
          break;
        case 'reactNative':
          self.storage.docLanguage = 6
          self.storage.favoriteLanguage = 6;
          break;
        case 'jquery':
          self.storage.docLanguage = 7
          self.storage.favoriteLanguage = 7;
          break;
        case 'vuejs':
          self.storage.docLanguage = 8
          self.storage.favoriteLanguage = 8;
          break;
      }
      self.selectedPlatform = starterAppId;
      self.templateUrl = KickstartService.getPlatformContent(self.selectedPlatform + "_" + self.selectedMode);
      AnalyticsService.track('PlatformSelected', {starterApp: starterAppId, mode:$state.params.mode});
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

    // Force-redirect to the selected documentation from local storage
    self.goToDefault = function()
    {
      if(self.storage.docLanguage) {
        var options = {};
        options[1] = 'ng1';
        options[2] = 'ng2';
        options[3] = 'ionic1';
        options[4] = 'ionic2';
        options[5] = 'redux';
        options[6] = 'reactNative';
        options[7] = 'jquery';
        options[8] = 'vuejs';
        self.selectedPlatform = options[self.storage.docLanguage];
        var state = ($state.current.parent == "apps" ? "docs.starter_app_select-open" : "docs.starter_app_select");
        $state.go(state, {starterAppId: self.selectedPlatform, mode:$state.params.mode, newApp: $state.params.newApp});
      }
    };

    // If a user has already selected a platform for documentation, always go to that platform
    self.goToDefault();
  }
}());
