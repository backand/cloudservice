
(function  () {

  angular.module('app')
    .controller('SignUpController',["$scope",'AuthService','$state','SessionService','$timeout','NotificationService',SignUpController]);

  function SignUpController($scope,AuthService,$state,SessionService,$timeout,NotificationService){
    var self = this;

    SessionService.ClearCredentials();

    this.loading = false;

    this.signUp = function(){
      self.loading = true;
      AuthService.signUp(self.firstName, self.lastName, self.email, self.appName, self.password)
        .success(function (data) {
          NotificationService.add('success','a confirmation Email was send to '+self.email);
          $state.go('sign_in');

        })
        .error(function (data) {
          debugger;
          self.loading = false;
          self.error = data.error_description;
          $timeout(function() {
            self.error = undefined;
          }, 3000);

        });
    }
  }
}());







