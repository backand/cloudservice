(function  () {
    'use strict';
  angular.module('app')
    .controller('ForgotController',["$scope", '$modalInstance','Uemail','AuthService',ForgotController]);

  function ForgotController($scope, $modalInstance,Uemail,AuthService){
    var self = this;

    this.email = Uemail;

    this.ok = function () {
      AuthService.forgot(self.email)
        .success(function(data){
          $modalInstance.close(self.email);
        })
        .error(function(err){

        })
    };

    this.cancel = function () {
      $modalInstance.dismiss('cancel');
    };


  }
}());
