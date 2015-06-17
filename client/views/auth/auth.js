
(function  () {

  angular.module('backand')
    .controller('AuthController', ['AuthService', AuthController]);

  function AuthController(AuthService) {
    var self = this;

    self.socials = AuthService.socials;

    self.socialLogin = function (social) {
      AuthService.socialLogin(social);
    }

  }

}());
