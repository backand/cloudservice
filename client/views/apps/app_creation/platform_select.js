(function () {
  'use strict';

  angular.module('backand.apps')
    .controller('PlatformSelectController', ['PlatformsService', PlatformSelectController]);

  function PlatformSelectController(PlatformsService) {

    var self = this;

    self.platforms = PlatformsService.get();
    self.platforms = _.chunk(self.platforms, 4);
  }
}());
