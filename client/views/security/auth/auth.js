/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityAuth($window, $modal, $stateParams, $log, usSpinnerService, NotificationService, SecurityService, $scope) {

    var self = this;
    self.appName = SecurityService.appName = $stateParams.name;
    SecurityService.getRoles().then(rolesSuccessHandler,errorHandler);
    function rolesSuccessHandler(data){
      self.roles= data.data.data;
    }
  }

  angular.module('app')
    .controller('SecurityUsers', [
      '$window',
      '$modal',
      '$stateParams',
      '$log',
      'usSpinnerService',
      'NotificationService',
      'SecurityService',
      '$scope',
      SecurityAuth
    ]);

}());
