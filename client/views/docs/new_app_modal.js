(function () {
  'use strict';
  angular.module('backand')
    .controller('NewAppModalController', [
      '$modalInstance',
      'AnalyticsService',
      NewAppModalController
    ]);
  function NewAppModalController($modalInstance, AnalyticsService) {
    var self = this;

    self.onAppAdded = function () {
      AnalyticsService.track('create app from docs', {app: self.appName});
      $modalInstance.dismiss();
    }
  }
})();
