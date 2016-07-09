(function  () {
  'use strict';
  angular.module('backand')
    .controller('DeleteAccountController',['$modalInstance', 'AccountService', 'SessionService', 'usSpinnerService', '$state', DeleteAccountController]);

  function DeleteAccountController($modalInstance, AccountService, SessionService, usSpinnerService, $state){
    var self = this;

    self.email = SessionService.currentUser;

    self.delete = function () {
      usSpinnerService.spin('delete-app');
      AccountService.delete().then(deleteSuccessHandler, deleteFailureHandler);
    };

    function deleteSuccessHandler() {
      usSpinnerService.stop('delete-app');
      $state.go('apps.index');
      $modalInstance.close(true);
    }

    function deleteFailureHandler(data) {
      self.error = data.data.error;
    }
  }
}());
