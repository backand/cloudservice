(function () {

  angular.module('backand')
    .controller('SignUpController', ['AuthService', '$state', 'SessionService', '$timeout', SignUpController]);

  function SignUpController(AuthService, $state, SessionService, $timeout){

    var self = this;
    self.fullName = "yrv07";
    self.email = "yrv07@devitout.com";
    self.password = "123456";
    self.repassword = "123456";
    (function init() {
      self.loading = false;

      //for automatic sign up
      if($state.params.i == 1) {
        self.fullName = $state.params.name;
        self.email = $state.params.username;
        self.password = Math.random().toString(36).substring(7);
        self.repassword = self.password;
        $timeout(function() {
          self.signUp();
        }, 100);
      }
    }());

    self.signUp = function () {
      self.loading = true;
      AuthService.signUp(self.fullName, self.email, self.password)
        .success(function (data) {

          AuthService.signIn({username: self.email, password: self.password})
            .success(function (data) {
              SessionService.setCredentials(data, self.email);
              if(analytics)
                analytics.identify(SessionService.getUserId(), {
                  name: self.fullName,
                  email: self.email,
                  createdAt: new Date().getTime()
                });
              AuthService.trackSignupEvent(self.fullName, self.email);
              $state.go('apps.index');
            })
            .error(function (data) {
              self.loading = false;
              self.error = data.error_description;
              $timeout(function() {
                self.error = undefined;
              }, 3000);

            });
        })
        .error(function (data) {
          self.loading = false;
          self.error = data.error_description;
          $timeout(function () {
            self.error = undefined;
          }, 3000);
        });
    }
  }

}());














