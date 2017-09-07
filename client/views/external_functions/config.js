/**
 * @ngdoc overview
 * @name backand.externalFunctions
 *
 * @module backand.externalFunctions
 *
 * @description
 * A module, responsible for lambda function configuration
 * Assign lambda functions to user
 * Manage AWS connection credentials
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  /**
   * Create a module 'backand.externalFunctions'
   */
  angular
    .module('backand.externalFunctions', []);

  /**
   * state configuration
   */
  angular
    .module('backand.externalFunctions')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('functions.externalFunctions', {
          url: '/external-functions?new&source',
          template: '<external-functions></external-functions>'
        });
    }]);

})();
