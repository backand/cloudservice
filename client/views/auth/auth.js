
(function  () {

  angular.module('backand')
    .controller('AuthController', ['AuthService', 'SessionService', 'HttpBufferService', 'NotificationService', '$state', 'usSpinnerService', AuthController]);

  function AuthController(AuthService, SessionService, HttpBufferService, NotificationService, $state, usSpinnerService) {
    var self = this;

    self.flags = AuthService.flags;
    self.flags.authenticating = false;

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
          NotificationService.add('error', error.data.error_description ? error.data.error_description : error.data);
          usSpinnerService.stop("socialSignin");
        });
    }

  }

}());
