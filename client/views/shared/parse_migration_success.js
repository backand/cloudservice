(function () {
  'use strict';

  angular.module('controllers')
    .controller('ParseSuccessController',
    ['$modalInstance', ParseSuccessController]);

  function ParseSuccessController($modalInstance) {
    var self = this;

    self.close = function () {
      $modalInstance.dismiss();
    };
  }


}());

