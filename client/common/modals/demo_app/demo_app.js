/**
 * @ngdoc controller
 * @name common.modals.controller.DemoAppModalController
 * @module common.modals
 *
 * @description
 * A controller to manage state of demo app modal
 *
  * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('common.modals')
    .controller('DemoAppModalController', [
      '$modalInstance',
      '$scope',
      function ($modalInstance, $scope) {
        var $ctrl = this;

        //expose bindable method
        $ctrl.modalInstance  = $modalInstance;
      }]);
})();
