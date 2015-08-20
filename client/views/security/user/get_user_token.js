(function () {

  angular.module('backand')
    .controller('GetUserTokenController', ['$modalInstance', 'SecurityService', 'username', 'ConfirmationPopup', GetUserTokenController]);

  function GetUserTokenController(modalInstance, SecurityService, username, ConfirmationPopup) {
    var self = this;

    self.userData = {username: username};

    self.token = '****************';

    self.getToken = function () {
      SecurityService.getUserToken(self.userData.username)
        .then(function (response) {
          self.token = response.data;
        });
    };

    self.getToken();

    self.closeGetToken = function () {
      modalInstance.dismiss('cancel');
    };

    self.resetToken = function () {
      ConfirmationPopup.confirm('After reset, you need to update all the relevant code associated with it.', 'Reset', 'Cancel')
        .then(function (result) {
          if (result) {
            SecurityService.resetUserToken(self.userData.username)
              .then(function (response) {
                self.token = response.data;
              });
          }
        });
    };
  }

}());
