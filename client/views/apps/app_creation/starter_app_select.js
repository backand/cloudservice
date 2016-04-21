(function () {
  'use strict';

  angular.module('backand.apps')
    .controller('StarterAppSelectController', ['StarterAppService', 'PlatformsService', '$state', StarterAppSelectController]);

  function StarterAppSelectController(StarterAppService, PlatformsService, $state) {

    var self = this;

    self.starterApps = StarterAppService.get();
    self.platforms = PlatformsService.get();
    self.platforms = self.platforms.slice(0, 4);
    self.selectedPlatform = $state.params.platformName;
    self.starterApps = _.chunk(self.starterApps, 3);
  }
}());
