(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('PlatformSelectController', ['PlatformsService', '$state', PlatformSelectController]);

  function PlatformSelectController(PlatformsService, $state) {

    var self = this;

    self.platforms = PlatformsService.get();
    self.platforms = _.chunk(self.platforms, 4);

    self.choosePlatform = function (platform) {
      $state.go('docs.starter_app_select', {platformName: platform});
    }
  }
}());
