(function () {

  angular.module('backand')
    .controller('ChangeUserPasswordController', ['$modalInstance', ChangeUserPasswordController]);

  function ChangeUserPasswordController(modalInstance) {
    var self = this;

    //self.rowData = rowData;

    self.savePassword = function () {
      modalInstance.close();
    };

    self.cancelNewPassword = function () {
      modalInstance.dismiss('cancel');
    };

  }

}());
