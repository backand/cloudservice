
(function  () {

  angular.module('backand')
    .controller('AuthController', ['AuthService', 'SessionService', 'HttpBufferService', 'NotificationService', '$state', 'usSpinnerService', 'AuthLayoutService', AuthController]);

  function AuthController(AuthService, SessionService, HttpBufferService, NotificationService, $state, usSpinnerService, AuthLayoutService) {
    var self = this;

    self.flags = AuthService.flags;
    self.flags.authenticating = false;

    self.template = AuthLayoutService.flags.landing && $state.is('sign_up') ? 'views/auth/auth_landing.html' : 'views/auth/auth_regular.html';

    SessionService.clearCredentials();
    // when entering login page, reject all pending http requests which were rejected with 401
    HttpBufferService.rejectAll();

    if ($state.params.error) {
      NotificationService.add('error', JSON.parse($state.params.error).message);
    }

    self.socials = AuthService.socials;

    self.socialLogin = function (social) {
      self.flags.authenticating = true;
      usSpinnerService.spin("socialSignin");
      AuthService.socialLogin(social)
        .then(function (response) {
          var requestedState = SessionService.getRequestedState();
          $state.go(requestedState.state || 'apps.index', requestedState.params);
        })
        .catch(function (error) {
          self.flags.authenticating = false;
          usSpinnerService.stop("socialSignin");
          if (error.data) {
            NotificationService.add('error', error.data.error_description || error.data);
          }
        });
    }

  }

}());
