
(function  () {

  angular.module('app')
    .controller('SignUpController',["$scope",'AuthService','$state','SessionService','$timeout','NotificationService', SignUpController]);

  function SignUpController($scope,AuthService,$state,SessionService,$timeout,NotificationService){
    var self = this;

    SessionService.ClearCredentials();

    this.loading = false;

    this.signUp = function(){
      self.loading = true;
      AuthService.signUp(self.fullName, self.email, self.password)
        .success(function (data) {
          //NotificationService.add('success','a confirmation Email was send to '+self.email);
          //do login
          AuthService.signIn(self.email,self.password)
              .success(function (data) {
                  SessionService.setCredentials(data);
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







