(function  () {
    'use strict';
  angular.module('backand')
    .controller('changePasswordController', ['AuthService', '$state', '$location', 'NotificationService', '$timeout', changePasswordController]);

  function changePasswordController(AuthService, $state, $location, NotificationService, $timeout){
    var self = this;
    this.loading = false;

    this.submit = function(){
      this.loading = true;
      AuthService.resetPassword(self.password, $location.search().id)
        .success(function(data){
          NotificationService.add('success', 'password changed');
          $state.go('sign_in');
        })
          .error(function (data) {
              self.loading = false;
              self.error = data.error_description;
              $timeout(function() {
                  self.error = undefined;
              }, 3000);

          });
    }


  }
}());
