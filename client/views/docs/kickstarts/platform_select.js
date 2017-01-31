(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('PlatformSelectController', ['PlatformsService', '$state', PlatformSelectController]);

  function PlatformSelectController(PlatformsService, $state) {

    var self = this;

    self.platforms = PlatformsService.get();
    self.platforms = _.chunk(self.platforms, 4);

    self.choosePlatform = function (starterAppId) {
      $state.go('docs.starter_app_select', {starterAppId: starterAppId, mode:$state.params.mode});
    }
  }
}());
