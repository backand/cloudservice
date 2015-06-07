(function () {

  angular.module('backand')
    .controller('ChangeUserPasswordController', ['$modalInstance', 'SecurityService', 'username', 'NotificationService', ChangeUserPasswordController]);

  function ChangeUserPasswordController(modalInstance, SecurityService, username, NotificationService) {
    var self = this;

    self.userData = {username: username};

    self.savePassword = function () {
      SecurityService.setUserPassword(self.userData)
        .then(function () {
          NotificationService.add('success', 'Password was changed');
          modalInstance.close();
        });
    };

    self.cancelNewPassword = function () {
      modalInstance.dismiss('cancel');
    };

  }

}());
