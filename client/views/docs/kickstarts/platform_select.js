(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('PlatformSelectController', ['AppsService', 'PlatformsService', '$state','usSpinnerService','$modal', PlatformSelectController]);

  function PlatformSelectController(AppsService, PlatformsService, $state, usSpinnerService, $modal) {

    var self = this;

    (function init() {
      usSpinnerService.spin("connecting-app-to-db");
      self.platforms = PlatformsService.get();
      self.platforms = _.chunk(self.platforms, 4);
      self.isAppOpened = !_.isEmpty(AppsService.currentApp);
      self.currentApp = AppsService.currentApp;

      if($state.params.newApp && self.currentApp.DatabaseStatus == 1){
        $rootScope.$broadcast('AppDbReady', self.currentApp.Name);
      }
    }());

    self.isNew = function () {
      var isNew = !_.isEmpty(AppsService.currentApp) && AppsService.currentApp.DatabaseStatus == 2;
      if (isNew) {
        usSpinnerService.spin("connecting-app-to-db");
      }
      else {
        usSpinnerService.stop("connecting-app-to-db");
      }
      return isNew;
    };

    self.newApp = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/docs/new_app_modal.html',
        controller: 'NewAppModalController',
        controllerAs: 'newAppModal'
      });
    };

    self.choosePlatform = function (starterAppId) {
      $state.go('docs.starter_app_select', {starterAppId: starterAppId, mode:$state.params.mode});
    }
  }
}());
