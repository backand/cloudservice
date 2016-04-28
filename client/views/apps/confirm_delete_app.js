(function  () {
  'use strict';
  angular.module('backand')
    .controller('ConfirmDeleteApp',['$scope', '$modalInstance', 'appName', ConfirmDeleteApp]);

  function ConfirmDeleteApp($scope, $modalInstance, appName){
    var self = this;

    self.appName = appName;

    self.delete = function () {
      $modalInstance.close(true);
    };

    self.cancel = function () {
      $modalInstance.dismiss('cancel');
    };


  }
}());
