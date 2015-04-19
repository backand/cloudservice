
(function  () {

  angular.module('backand')
    .controller('SignUpController',["$scope",'AuthService','$state','SessionService','$timeout','$analytics', 'AppsService', SignUpController]);

  function SignUpController($scope,AuthService,$state,SessionService,$timeout,$analytics, AppsService){
    var self = this;


    SessionService.ClearCredentials();

    this.loading = false;

    this.signUp = function(){
      self.loading = true;
      AuthService.signUp(self.fullName, self.email, self.password)
        .success(function (data) {
          $analytics.eventTrack('signup',{});
          AuthService.signIn(self.email,self.password)
              .success(function (data) {
                  SessionService.setCredentials(data, self.email);
                  //create todos sample app
                  var exampleAppName = 'todo' + AuthService.getUserId();
                  if(exampleAppName != 'todo0'){
                    AppsService.add(exampleAppName, 'My First App - Todo list example')
                      .then(
                      $state.go('apps.index')
                    );
                  }
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







