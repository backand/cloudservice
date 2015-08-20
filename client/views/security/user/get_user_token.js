(function () {

  angular.module('backand')
    .controller('GetUserTokenController', ['$modalInstance', 'SecurityService', 'username', GetUserTokenController]);

  function GetUserTokenController(modalInstance, SecurityService, username) {
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
      SecurityService.resetUserToken(self.userData.username)
        .then(function (response) {
          self.token = response.data;
        });
    };
  }

}());
