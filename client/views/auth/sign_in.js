
(function  () {

  angular.module('app')
    .controller('SignInController',["$scope",'AuthService','$state','SessionService','$timeout',SignInController]);

  function SignInController($scope,AuthService,$state,SessionService,$timeout){
    var self = this;

    SessionService.ClearCredentials();

    this.signIn = function(){

      AuthService.signIn(self.userName,self.userPassword)
        .success(function (data) {
          SessionService.setCredentials(data);
          $state.go('apps.index');
        })
        .error(function (data) {
          console.log(data.error_description);
          self.error = data.error_description;
          $timeout(function() {
            self.error = undefined;
          }, 3000);

        });
    }
  }
}());
