
(function  () {

  angular.module('app')
    .controller('SignInController',["$scope",'AuthService','$state','SessionService',SignInController]);

  function SignInController($scope,AuthService,$state,SessionService){
    var self = this;

    SessionService.ClearCredentials();

    this.signIn = function(){
      // TODO: Add generic spinner
      // TODO: Don't save user & pass
      // TODO: Add error service

      AuthService.signIn(self.userName,self.userPassword)
        .success(function (data) {
          SessionService.setCredentials(self.userName, self.userPassword ,data);
          $state.go('apps.index');
        })
        .error(function (data) {
          console.log(data.error_description);
          self.error = data.error_description;
        });
    }
  }
}());
