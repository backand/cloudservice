(function () {

  angular.module('backand')
    .controller('SignUpController', ['AuthService', '$state', 'SessionService', '$timeout', 'NotificationService','$rootScope', SignUpController]);

  function SignUpController(AuthService, $state, SessionService, $timeout, NotificationService, $rootScope) {

    var self = this;

    (function init() {
      self.flags = AuthService.flags;
      self.loading = false;
      self.twitterMissingEmail = false;
      self.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

      //for automatic sign up
      if ($state.params.i == 1) {
        self.fullName = $state.params.name;
        self.email = $state.params.username;
        self.password = Math.random().toString(36).substring(7);
        self.repassword = self.password;
        $timeout(function () {
          self.signUp();
        }, 100);
      }
    }());
    
    self.emailChanged = function (email){
      self.twitterMissingEmail = false;
      if(email.$valid){
        $rootScope.$emit('email:changed', email.$viewValue);
      }
    };

    $rootScope.$on('no-required-email', function (event, data) {
      self.twitterMissingEmail = true;
    });

    self.signUp = function () {
      self.flags.authenticating = true;
      self.loading = true;

      AuthService.signUp(self.fullName, self.email, self.password)
        .then(function (response) {
          var requestedState = SessionService.getRequestedState();
          $state.go(requestedState.state || 'apps.index', requestedState.params);
        })
        .catch(function (data) {
          self.flags.authenticating = false;
          self.loading = false;
          if (data) {
            self.error = data.error_description;
            $timeout(function () {
              self.error = undefined;
            }, 3000);
          }
        });
    };

  }

}());














