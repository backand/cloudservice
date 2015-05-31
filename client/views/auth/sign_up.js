
(function () {

  angular.module('backand')
    .controller('SignUpController', ['AuthService', '$state', 'SessionService', '$timeout', SignUpController]);

  function SignUpController(AuthService, $state, SessionService, $timeout){
    var self = this;

    SessionService.ClearCredentials();

    this.loading = false;

    this.signUp = function () {
      self.loading = true;

      AuthService.signUpAndIn(self.fullName, self.email, self.password)
        .then(function () {
          $state.go('apps.index');
        }, function (error) {
          self.loading = false;
          self.error = error.error_description;
          $timeout(function () {
            self.error = undefined;
          }, 3000);
        });
    };

    if($state.params.i == 1) {
      self.fullName = $state.params.name;
      self.email = $state.params.username;
      self.password = Math.random().toString(36).substring(7);
      self.signUp();
    }

  }
}());







