/**
 * @ngdoc overview
 * @name backand.appInitializer
 *
 * @module backand
 *
 * @description
 * This is very first module which is mounted at very first
 * This module get the configuration from server before application get bootstrap
 * Store configurations in constant service to be used in application
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('backand.appInitializer', ['backand.ENV_CONFIG'])
    .run(['$http','env', function run($http, env) {
      env = env || 'dev';
      $http.get('/config/env/' + env + '.json').then(function (data) {
        angular.module('backand.consts').constant('CONSTS', data.data);
        /**
         * Bootstrap application
         * @name backand
         * @namespace backand
         */
        angular.bootstrap(document, ['backand']);
      });
    }]);

  /**
   * Bootstrap appInitializer
   * @name backand
   * @namespace backand
   */
  angular.element(document).ready(function () {
    //angular.bootstrap(document, ['backand']);
    angular.bootstrap(document.getElementById('appConfig'), ['backand.appInitializer']);
  });
})();