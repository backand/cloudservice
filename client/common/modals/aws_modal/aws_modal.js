/**
 * @ngdoc controller
 * @name common.modals.controller.AwsModalController
 * @module common.modals
 *
 * @description
 * A controller to manage state of AWS credentials modal
 *
  * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('common.modals')
    .controller('AwsModalController', [
      '$modalInstance',
      function ($modalInstance) {
        var $ctrl = this;
        $ctrl.$modalInstance = $modalInstance;
      }]);
})();
