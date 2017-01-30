(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('KickstartController', ['KickstartService', '$state', KickstartController]);

  function PlatformSelectController(KickstartService, $state) {

    var self = this;

    self.platforms = PlatformsService.get();
    self.platforms = _.chunk(self.platforms, 4);

    self.choosePlatform = function (platform) {
      $state.go('docs.kickstart_selected', {platformName: platform});
    }
  }
}());
