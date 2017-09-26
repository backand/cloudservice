/**
 * @ngdoc directive
 * @name backand.directive.externalStorage
 * @module backand
 *
 * @description
 * a main Component
 *
  * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('backand')
    .directive('externalStorage', [function () {
      return {
        restrict: 'E',
        scope: {
          appKeys: '='
        },
        templateUrl: 'views/hosting/external_storage/externalStorage.html',
        controllerAs: '$ctrl',
        bindToController: true,
        controller: [
          '$log',
          'usSpinnerService',
          '$rootScope',
          function ($log, usSpinnerService, $rootScope) {
            $log.info('Component externalStorage has initialized');
            var $ctrl = this;
            /**
             *
             * public methods
             */
            $ctrl.addNewStorageProvider = addNewStorageProvider;
            /**
             * public properties
             */
            /**
           * call initialization to initialize controllers properties 
           */
            initialization();
            /**
             * @name initialization
             * @description
             * function to initialize properties and call function at very first.
             */
            function initialization() {
            }

            /**
             * @function
             * @name addNewStorageProvider
             * @description trgger event to launch addNewStorageProvider
             * @see newProvider Component
             */
            function addNewStorageProvider() {
              $rootScope.$emit('EVENT:ADD_PROVIDER', {
                type: 'STORAGE'
              });
            }

            //end of controller
          }]
      };
    }]);
})();
