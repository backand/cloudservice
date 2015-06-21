
(function  () {

  angular.module('backand')
    .controller('SignInController', ['AuthService', '$state', 'SessionService', '$timeout', '$modal', 'NotificationService', SignInController]);

  function SignInController(AuthService, $state, SessionService, $timeout, $modal, NotificationService) {
    var self = this;

    this.loading = false;

    this.signIn = function () {
      self.loading = true;
      AuthService.signIn({username: self.userName, password: self.userPassword})
        .success(function (data) {
          SessionService.setCredentials(data, self.userName);
          $state.go('apps.index');
        })
        .error(function (data) {
          self.loading = false;
          self.error = data.error_description;
          $timeout(function () {
            self.error = undefined;
          }, 3000);

        });
    };

    this.open = function () {
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







