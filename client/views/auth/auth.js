
(function  () {

  angular.module('backand')
    .controller('AuthController', ['AuthService', 'SessionService', 'HttpBufferService', 'NotificationService', '$state', 'usSpinnerService', 'AuthLayoutService','$rootScope', AuthController]);

  function AuthController(AuthService, SessionService, HttpBufferService, NotificationService, $state, usSpinnerService, AuthLayoutService, $rootScope) {
    var self = this;

    self.flags = AuthService.flags;
    self.flags.authenticating = false;
    self.email = '';

    self.template = AuthLayoutService.flags.landing && $state.is('sign_up') ? 'views/auth/auth_landing.html' : 'views/auth/auth_regular.html';

    SessionService.clearCredentials();
    // when entering login page, reject all pending http requests which were rejected with 401
    HttpBufferService.rejectAll();

    if ($state.params.error) {
      NotificationService.add('error', JSON.parse($state.params.error).message);
    }

    $rootScope.$on('email:changed', function (event, data) {
      self.email = data; // 'Emit!'
    });

    self.socials = AuthService.socials;

    self.socialLogin = function (social) {
      self.flags.authenticating = true;

      if(social.requireEmail && self.email === '' && $state.current.name === 'sign_up'){
        $rootScope.$emit('no-required-email');
        self.flags.authenticating = false;
        return;
      }

      usSpinnerService.spin("socialSignin");
      AuthService.socialLogin(social, false, self.email)
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
