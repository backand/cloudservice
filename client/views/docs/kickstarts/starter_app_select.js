(function () {
  'use strict';

  angular.module('backand.apps')
    .controller('StarterAppSelectController', ['StarterAppService', 'PlatformsService', '$state', StarterAppSelectController]);

  function StarterAppSelectController(StarterAppService, PlatformsService, $state) {

    var self = this;

    self.platforms = PlatformsService.get();
    self.selectedPlatform = $state.params.platformName;
    self.starterApps = _.chunk(self.starterApps, 3);
    self.starterApps = StarterAppService.get(self.selectedPlatform);

    self.chooseStarterApp = function (starterApp) {
      self.selectedStarterApp = starterApp;
    };

    self.changePlatform = function (platform) {
      self.selectedPlatform = platform;
      self.starterApps = StarterAppService.get(platform);
    }
  }
}());
