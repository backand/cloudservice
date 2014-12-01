(function  () {
    'use strict';
  angular.module('app')
    .controller('changePasswordController',["$scope",'AuthService','$state',changePasswordController]);

  function changePasswordController($scope,AuthService,$state){
    var self = this;


    this.sumbit = function(){
      AuthService.resetPassword(self.password, $state.params.id)
        .success(function(data){
          NotificationService.add('success', 'password changed');
          $state.go('sign_in');
        })
        .error(function(err){

        })
    }


  }
}());
