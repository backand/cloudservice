
(function  () {

  angular.module('backand')
    .controller('SignInController', ['AuthService', '$state', 'SessionService', '$modal', 'NotificationService', SignInController]);

  function SignInController(AuthService, $state, SessionService, $modal, NotificationService) {
    var self = this;

    self.flags = AuthService.flags;
    self.loading = false;

    self.signIn = function () {
      self.flags.authenticating = true;
      self.loading = true;
      self.error = undefined;
      AuthService.signIn({username: self.userName, password: self.userPassword})
        .then(function (response) {
          var requestedState = SessionService.getRequestedState();
          $state.go(requestedState.state || 'apps.index', requestedState.params);
        })
        .catch(function (response) {
          self.flags.authenticating = false;
          self.loading = false;
          self.error = response.data.error_description;
        })
    };

    self.open = function () {
      self.modalOn = true;
      var modalInstance = $modal.open({
        templateUrl: 'views/auth/forgot_modal.html',
        controller: 'ForgotController as forgot',
        resolve: {
          Uemail: function () {
            return self.userName;
          }
        }
      });

      modalInstance.result.then(function (userEmail) {
        self.modalOn = false;
        NotificationService.add('success', "Please check your mailbox - we've sent you an email with a link to reset your password.");
      },function(){
        self.modalOn = false;
      });

    };
  }

}());







