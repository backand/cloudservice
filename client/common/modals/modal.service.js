/**
 * @ngdoc service
 * @name common.modals.modalService
 * @module common.modals
 *
 * @description
 * A service to manage all type of modals
 * 
 * @requires $modal
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('common.modals')
    .service('modalService', [
      '$log',
      '$modal',
      'CONSTS',
      function ($log, $modal, CONSTS) {
        var self = this;

        /**
         * Exposed bindable methods
         */
        self.demoApp = demoApp;
        self.awsCredentials = awsCredentials;

        /**
         * Exposed bindable properties
         */

        /**
         * @name demoApp
         * @description show demo app modal
         * 
         * @param {object} options Options to be used in modal configuration
         * @returns promise
         */
        function demoApp(options) {
          options = options || {};
          return $modal.open({
            templateUrl: options.templateUrl || 'common/modals/demo_app/demo_app.html',
            keyboard: false,
            size: options.size || 'md',
            controller: 'DemoAppModalController',
            bindToController: true,
            controllerAs: '$ctrl'
          }).result;
        }

        /**
       * @name awsCredentials
       * @description show demo app modal
       * 
       * @param {object} options Options to be used in modal configuration
       * @returns promise
       */
        function awsCredentials(options) {
          options = options || {};
          return $modal.open({
            templateUrl: options.templateUrl || 'common/modals/aws_modal/aws_modal.html',
            keyboard: false,
            size: options.size || 'md',
            controller: 'AwsModalController',
            bindToController: true,
            controllerAs: '$ctrl'
          }).result;
        }

        //end of service  
      }]);


})();