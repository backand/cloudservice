(function () {
  'use strict';
  angular.module('backand')
    .controller('NewAppModalController', [
      '$modalInstance',
      EditObjectController
    ]);
  function EditObjectController($modalInstance) {
    var self = this;

    self.onAppAdded = function () {
      $modalInstance.dismiss();
    }
  }
})();
