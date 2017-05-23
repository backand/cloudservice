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
        templateUrl: 'views/external_functions/externalFunctions.html',
        controllerAs: '$ctrl',
        bindToController: true,
        controller: [
          '$log',
          'usSpinnerService',
          'CloudService',
          'NotificationService',
          function ($log, usSpinnerService, CloudService, NotificationService) {
            $log.info('Component externalFunctions has initialized');
            var $ctrl = this,
              connectionModel = {
                AccessKeyId: '',
                AwsRegion: 'us-west-2',
                accountId: '',
                Name: 'Main',
                CloudVendor: 'AWS',
                EncryptedSecretAccessKey: ''
              };
            /**
            * call initialization to initialize controllers properties 
            */
            initialization();

            /**
             *
             * public methods
             */
            $ctrl.saveConnection = saveConnection;
            /**
             * public properties
             */
            $ctrl.aws = angular.copy(connectionModel);
            /**
             * @name initialization
             * @description
             * function to initialize properties and call function at very first.
             */
            function initialization() {
              $ctrl.sections = {
                guideline: true,
                awsConnection: true,
                lambdaFunctions: false
              };
              usSpinnerService.stop('loading');
              getAwsConnection();
              getLambdaFunctions();
            }

            function getAwsConnection() {
              usSpinnerService.spin('loading');
              CloudService
                .getAwsConnection()
                .then(function (response) {
                  $ctrl.aws = response.data.data[0] || angular.copy(connectionModel);
                  $log.info('Connections credentials loaded', response);
                  usSpinnerService.stop('loading');
                }).catch(function (error) {
                  $log.error('Error while fetching connection details', error);
                  usSpinnerService.stop('loading');
                });
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
             * @name saveConnection
             * @description  function to save connection details
             * validate credentials on client side before send to API
             * 
             * @returns void
             */
            function saveConnection() {
              usSpinnerService.spin('loading');
              $log.info('saveConnection is called with :', $ctrl.aws);
              var request = angular.copy($ctrl.aws);
              if (request.__metadata) {
                request.id = request.__metadata.id;
              }
              request = _.chain(request)
                .pick(['AccessKeyId', 'AwsRegion', 'CloudVendor', 'EncryptedSecretAccessKey', 'id', 'Name'])
                .pick(function (v, k) {
                  return v ? true : false;
                })
                .value();
              $log.warn('Connection request', request);
              CloudService
                .saveAwsConnection(request)
                .then(function (response) {
                  $log.info('Connection details are saved', response);
                  //get lambda functions when connection is saved first time
                  if (!request.id) {
                    getLambdaFunctions();
                  }
                  usSpinnerService.stop('loading');
                  NotificationService.add('success', 'Connection details are saved successfully.');
                }).catch(function (error) {
                  $log.error('Error while saving conncetions detail', error);
                  usSpinnerService.stop('loading');
                });
            }

            //end of controller
          }]
      };
    }]);
})();
