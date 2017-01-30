(function () {
  'use strict';

  angular.module('backand.apps')
    .controller('StarterAppSelectController', ['StarterAppService', 'PlatformsService', '$state', StarterAppSelectController]);

  function StarterAppSelectController(StarterAppService, PlatformsService, $state) {

    var self = this;

    self.platforms = PlatformsService.get();
    self.selectedPlatform = $state.params.platformName;
    self.starterApps = StarterAppService.get(self.selectedPlatform);
    self.starterApps = _.chunk(self.starterApps, 3);

    self.chooseStarterApp = function (starterApp) {
      self.selectedStarterApp = starterApp;

        $state.go('docs.kickstart_selected', {platformName: self.selectedStarterApp});
    };

    self.changePlatform = function (platform) {
      self.selectedPlatform = platform;
      self.starterApps = StarterAppService.get(platform);
      self.starterApps = _.chunk(self.starterApps, 3);
    }
  }
}());
