(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('KickstartController', ['KickstartService', '$state', '$scope', '$sce', KickstartController]);

  function KickstartController(KickstartService, $state, $scope, $sce) {

    var self = this;
    self.selectedPlatform = $state.params.platformName;
    self.templateUrl = KickstartService.getPlatformContent(self.selectedPlatform);
  };
}());
