/**
 * @ngdoc directive
 * @name backand.externalFunctions.directive.jsonParser
 * @module backand.externalFunctions
 *
 * @description
 * manage AWS connection
 *
  * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('backand.externalFunctions')
    .directive('jsonParser', [function () {
      return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'views/external_functions/providers/json-parser/json-parser.html',
        controllerAs: '$ctrl',
        bindToController: true,
        controller: [
          '$log',
          function ($log) {
            $log.info('Component awsConnection has initialized');
            var $ctrl = this;
            /**
            * call initialization to initialize controllers properties 
            */
            initialization();

            /**
             *
             * public methods
             */
            /**
             * public properties
             */
            /**
             * @name initialization
             * @description
             * function to initialize properties and call function at very first.
             */
            function initialization() {
              $log.info('jsonParser component');
            }
            //end of controller
          }]
      };
    }]);
})();
