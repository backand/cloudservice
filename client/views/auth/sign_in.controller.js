
(function  () {

  angular.module('app')
    .controller('SignInController',["$scope",'AuthService','$state',SignInController]);

  function SignInController(scope,AuthService,$state){

    var self = this;

    //this.error = "nop";

    this.userPassword = undefined;

    this.userName = undefined;

    AuthService.ClearCredentials();

    this.logIn = function(){

      self.dataLoading = true;


      //console.log(self.userPassword +' '+ self.userName);
      AuthService.logIn(self.userName,self.userPassword)
        .success(function (data) {
          AuthService.SetCredentials(self.userName, self.userPassword ,data);
          self.dataLoading = false;
          $state.go('apps.index');
        })
        .error(function (data) {
          console.log(data.error_description);
          self.dataLoading = false;
          self.error = data.error_description;
        });

    }

  }



}());
