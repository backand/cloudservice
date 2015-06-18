(function () {

  angular.module('backand')
    .controller('SignUpController', ['AuthService', '$state', 'SessionService', '$timeout', '$analytics', '$intercom', 'CONSTS', SignUpController]);

  function SignUpController(AuthService, $state, SessionService, $timeout, $analytics, $intercom, CONSTS){

    var self = this;

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
          $analytics.eventTrack('SignedUp', {"name": self.fullName});
          if($intercom){
            $intercom.boot({
              app_id: CONSTS.IntercomAppId,
              name: self.fullName,
              email: self.email,
              signed_up_at: new Date().getTime()
            });
            $intercom.trackEvent('SignedUp',{"name": self.fullName});
          }
          AuthService.signIn(self.email, self.password)
            .success(function (data) {
              SessionService.setCredentials(data, self.email);
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














