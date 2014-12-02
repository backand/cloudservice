(function  () {
    'use strict';
  angular.module('app')
    .controller('changePasswordController',["$scope",'AuthService','$state','$location','NotificationService',changePasswordController]);

  function changePasswordController($scope,AuthService,$state,$location,NotificationService){
    var self = this;


    this.submit = function(){
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
