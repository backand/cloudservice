/**
 * @ngdoc directive
 * @name backand.externalFunctions.directive.externalFunctions
 * @module backand.externalFunctions
 *
 * @description
 * a main Component
 *
  * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('backand.externalFunctions')
    .directive('externalFunctions', [function () {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'views/external_functions/externalFunctions.html',
        controllerAs: '$ctrl',
        bindToController: true,
        controller: [
          '$log',
          'usSpinnerService',
          'CloudService',
          '$modal',
          '$state',
          'modalService',
          function ($log, usSpinnerService, CloudService, $modal, $state, modalService) {
            $log.info('Component externalFunctions has initialized');
            var $ctrl = this;
            /**
            * call initialization to initialize controllers properties 
            */
            initialization();

            /**
             *
             * public methods
             */
            $ctrl.onSaveConnection = onSaveConnection;
            /**
             * public properties
             */
            /**
             * @name initialization
             * @description
             * function to initialize properties and call function at very first.
             */
            function initialization() {
              // options to <users> Component
              $ctrl.options = {
                view: 'lambdaLauncher'
              };
              //set first tab as activeTab
              $ctrl.activeTab = 0;
              //set collapsible panels
              $ctrl.sections = {
                guideline: true,
                awsConnection: true,
                lambdaFunctions: false
              };
              //opens modal for AWS credentials
              if (isNew()) {
                awsConnectionModal();
              } else {
                getLambdaFunctions();
              }
              usSpinnerService.stop('loading');
            }

            /**
             * @name getLambdaFunctions
             * @description  function to get lambda function by app
             * 
             * @returns void
             */
            function getLambdaFunctions() {
              usSpinnerService.spin('loading');
              CloudService
                .getLambdaFunctions()
                .then(function (response) {
                  $ctrl.lambdaFunctions = response.data.data[0] ? response.data.data[0].functions : [];
                  if ($ctrl.lambdaFunctions.length > 0) {
                    $ctrl.sections.lambdaFunctions = true;
                  }
                  $log.info('Lambda functions loaded', response);
                  usSpinnerService.stop('loading');
                }).catch(function (error) {
                  $log.error('Error while fetching Lambda functions', error);
                  usSpinnerService.stop('loading');
                });
            }
            /**
            * @name onSaveConnection
            * @description  function is called when AWS connection is saved/updated
            * Fetch new lambda functions 
            * 
            * @param {object} connection An object of connection details
            * @returns void
            */
            function onSaveConnection(connection) {
              $log.info('AWS connection is updated with -', connection);
              getLambdaFunctions();
            }

            /**
             * @name awsConnectionModal
             * @description opens modal/popup to configure AWS credentials
             * 
             * @returns void
             */
            function awsConnectionModal() {
              modalService
                .awsCredentials()
                .then(function (data) {
                  $log.info('connection with - ', data);
                  $state.transitionTo($state.current.name, {
                    new: undefined
                  }, {
                      reload: true
                    });
                }, function () {
                  $log.info('Cancelled AWS credentials to enter.');
                  modalService.demoApp().then(function () {
                  }, function () {
                    $state.transitionTo($state.current.name, angular.extend({}, $state.params, {
                      new: undefined
                    }), {
                        notify: false
                      });
                  });
                });
            }

            /**
             * @name isLauncher
             * @description check if current state has `new` param with valid value [1]
             * 
             * @returns boolean
             */
            function isNew() {
              var newApp = $state.params.new;
              return (typeof newApp !== 'undefined') && (newApp == 1);
            }

            //end of controller
          }]
      };
    }]);
})();
