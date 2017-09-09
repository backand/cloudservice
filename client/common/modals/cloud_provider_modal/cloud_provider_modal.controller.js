/**
 * @ngdoc controller
 * @name common.modals.controller.CloudProviderModalController
 * @module common.modals
 *
 * @description
 * A controller to manage state of cloud provider credentials modal
 *
  * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('common.modals')
    .controller('CloudProviderModalController', [
      '$modalInstance', 'options',
      function ($modalInstance, options) {
        var $ctrl = this;
        $ctrl.$modalInstance = $modalInstance;
        $ctrl.options = options;
        $ctrl.onSelectProvider = onSelectProvider;
      
        console.log('Modal $modalInstance', $modalInstance);
        console.log('options', options);


        function onSelectProvider(provider){
          $ctrl.provider = provider;
        }
      }]);
})();
