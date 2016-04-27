(function () {
  'use strict';

  angular.module('backand.apps')
    .controller('PlatformSelectController', ['PlatformsService', '$state', PlatformSelectController]);

  function PlatformSelectController(PlatformsService, $state) {

    var self = this;

    self.platforms = PlatformsService.get();
    self.platforms = _.chunk(self.platforms, 4);

    self.choosePlatform = function (platform) {
      $state.go('apps.starter_app_select', {platformName: platform});
    }
  }
}());
