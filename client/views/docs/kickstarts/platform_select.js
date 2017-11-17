(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('PlatformSelectController', ['AppsService', 'PlatformsService', '$state', '$rootScope', 'usSpinnerService', 'LocalStorageService','AnalyticsService', PlatformSelectController]);

  function PlatformSelectController(AppsService, PlatformsService, $state, $rootScope, usSpinnerService, LocalStorageService, AnalyticsService) {

    var self = this;

    self.storage = LocalStorageService.getLocalStorage();

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
      switch (starterAppId) {
        case 'ng1':
          self.storage.docLanguage = 1;
          self.storage.favoriteLanguage = 2;
          break;
        case 'ng2':
          self.storage.docLanguage = 2
          self.storage.favoriteLanguage = 3;
          break;
        case 'ionic1':
          self.storage.docLanguage = 3
          self.storage.favoriteLanguage = 2;
          break;
        case 'ionic2':
          self.storage.docLanguage = 4
          self.storage.favoriteLanguage = 3;
          break;
        case 'redux':
          self.storage.docLanguage = 5
          self.storage.favoriteLanguage = 4;
          break;
        case 'reactNative':
          self.storage.docLanguage = 6
          self.storage.favoriteLanguage = 4;
          break;
        case 'jquery':
          self.storage.docLanguage = 7
          self.storage.favoriteLanguage = 1;
          break;
        case 'vuejs':
          self.storage.docLanguage = 8
          self.storage.favoriteLanguage = 1;
          break;
      }
      var state = ($state.current.parent == "apps" ? "docs.starter_app_select_open" : "docs.starter_app_select");
      $state.go(state, {starterAppId: starterAppId, mode:$state.params.mode, newApp: $state.params.newApp});
      AnalyticsService.track('PlatformSelected', {starterApp: starterAppId, mode:$state.params.mode});
    };

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
        var state = ($state.current.parent == "apps" ? "docs.starter_app_select_open" : "docs.starter_app_select");
        $state.go(state, {starterAppId: options[self.storage.docLanguage], mode:$state.params.mode, newApp: $state.params.newApp});

      }
    }

    self.goToDefault();
  }
}());
