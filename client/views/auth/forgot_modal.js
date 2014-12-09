(function  () {
    'use strict';
  angular.module('app')
    .controller('ForgotController',["$scope", '$modalInstance','Uemail','AuthService','$timeout',ForgotController]);

  function ForgotController($scope, $modalInstance,Uemail,AuthService,$timeout){
    var self = this;

    this.email = Uemail;
    this.loading = false;

    this.ok = function () {
      this.loading = true;
      AuthService.forgot(self.email)
        .success(function(data){
          $modalInstance.close(self.email);
        })
          .error(function (data) {
              self.loading = false;
              self.error = data.error_description;
              $timeout(function() {
                  self.error = undefined;
              }, 3000);

          });
    };

    this.cancel = function () {
      $modalInstance.dismiss('cancel');
    };


  }
}());
