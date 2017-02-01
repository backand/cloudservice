(function () {
  'use strict';

  angular.module('backand.apps')
    .controller('StarterAppSelectController', ['KickstartService', 'PlatformsService', '$state', StarterAppSelectController]);

  function StarterAppSelectController(KickstartService, PlatformsService, $state) {

    var self = this;

    self.platforms = PlatformsService.get();
    self.selectedPlatform = $state.params.starterAppId || 'ng1';
    self.selectedMode = $state.params.mode;
    self.templateUrl = KickstartService.getPlatformContent(self.selectedPlatform + self.selectedMode);

    self.changePlatform = function (starterAppId) {
      self.selectedPlatform = starterAppId;
      self.templateUrl = KickstartService.getPlatformContent(self.selectedPlatform + self.selectedMode);
    }

    self.goToExisting = function() {
      $state.go('docs.platform_select_existing');
    };
  }
}());
