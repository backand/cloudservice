(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('KickstartController', ['KickstartService', '$state', KickstartController]);

  function PlatformSelectController(KickstartService, $state) {

    var self = this;
    self.selectedPlatform = $state.params.platformName;
    self.selectedPlatformContent = KickstartService.getPlatformContent(self.selectedPlatform);
    $scope.kickstartContent= $sce.trustAsHtml(self.selectedPlatformContent);
  };
}());
