(function(){
  'use strict';
  angular.module('backand')
    .controller('DeleteAccountController', ['SessionService', '$modalInstance', '$state', 'usSpinnerService', 'AccountService', DeleteAccountController]);

  function DeleteAccountController (SessionService, $modalInstance, $state, usSpinnerService, AccountService) {
    var self = this;

    self.email = SessionService.currentUser.username;

    self.deleteAccount = function () {
      usSpinnerService.spin('delete-app');
      AccountService.delete().then(deleteSuccessHandler, deleteFailureHandler);
    };

    function deleteSuccessHandler() {
      usSpinnerService.stop('delete-app');
      $state.go('apps.index');
      $modalInstance.close(true);
    }

    function deleteFailureHandler(data) {
      usSpinnerService.stop('delete-app');
      self.error = data.data.error;
    }

    self.cancel = function () {
      $modalInstance.dismiss('cancel');
    }
  }
}());
