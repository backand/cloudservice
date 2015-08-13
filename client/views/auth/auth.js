
(function  () {

  angular.module('backand')
    .controller('AuthController', ['AuthService', 'SessionService', 'NotificationService', '$state', AuthController]);

  function AuthController(AuthService, SessionService, NotificationService, $state) {
    var self = this;

    SessionService.ClearCredentials();

    if ($state.params.error) {
      NotificationService.add('error', JSON.parse($state.params.error).message);
    }

    self.socials = AuthService.socials;

    self.socialLogin = function (social) {
      AuthService.socialLogin(social)
        .catch(
          function (error) {
            NotificationService.add('error', error.data)
          }
        );
    }

  }

}());
