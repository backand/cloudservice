(function  () {
  'use strict';
  angular.module('backand')
    .controller('ChangePasswordController', ['AuthService', '$modalInstance', 'NotificationService', ChangePasswordController]);

  function ChangePasswordController(AuthService, $modalInstance, NotificationService){
    var self = this;

    self.changePassword = function () {
      AuthService.changePassword(self.userData.oldPassword, self.userData.newPassword)
        .then(function () {
          NotificationService.add('success', 'Password was changed');
          $modalInstance.close();
        })
    };

    self.cancelChangePassword = function () {
      $modalInstance.dismiss('cancel');
    }

  }
}());
