/**
 * @ngdoc directive
 * @name backand.externalFunctions.directive.awsConnection
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
    .directive('awsConnection', [function () {
      return {
        restrict: 'E',
        scope: {
          onSave: '&', // optional
          view: '@', //optional,
          modalInstance: '=?' //required if view is modal -in other words - required if this component is opened up in modal
        },
        templateUrl: 'views/external_functions/aws_connection/aws_connection.html',
        controllerAs: '$ctrl',
        bindToController: true,
        controller: [
          '$log',
          'usSpinnerService',
          'CloudService',
          'NotificationService',
          function ($log, usSpinnerService, CloudService, NotificationService) {
            $log.info('Component awsConnection has initialized');
            var $ctrl = this,
              connectionModel = {
                AccessKeyId: '',
                AwsRegion: [],
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
              $ctrl.view = $ctrl.view || 'default';
              $ctrl.modalInstance = $ctrl.modalInstance || {};

              $log.info('awsConnection was render with ' + $ctrl.view + ' view');
              $ctrl.sections = {
                guideline: true,
                awsConnection: true,
                lambdaFunctions: false
              };
              usSpinnerService.stop('connectionView');
              loadAwsRegion();
              getAwsConnection();
            }

            /**
             * @name loadAwsRegion
             * @description gets aws regions
             * stores to $ctrl.regions
             * 
             * @returns void
             */
            function loadAwsRegion() {
              CloudService
                .loadAwsRegion()
                .then(function (response) {
                  $ctrl.regions = response.data.data || [];
                });
            }

            /**
             * @name getAwsConnection
             * @description fetchs AWS connection details for a application
             * store connection details in $ctrl.aws
             * 
             * @returns void
             */
            function getAwsConnection() {
              usSpinnerService.spin('connectionView');
              CloudService
                .getAwsConnection()
                .then(function (response) {
                  var awsConnection = response.data.data[0] || angular.copy(connectionModel);
                  awsConnection.AwsRegion = _.words(awsConnection.AwsRegion, /[^,]+/g);
                  $ctrl.aws = awsConnection;
                  $log.info('Connections credentials loaded', response);
                  usSpinnerService.stop('connectionView');
                }).catch(function (error) {
                  $log.error('Error while fetching connection details', error);
                  usSpinnerService.stop('connectionView');
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
              usSpinnerService.spin('connectionView');
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
                .then(function (respone) {
                  successHandler(respone, request, $ctrl.aws);
                })
                .catch(function (error) {
                  $log.error('Error while saving conncetions detail', error);
                  usSpinnerService.stop('connectionView');
                });
            }

            function successHandler(response, request, model) {
              $log.info('Connection details are saved', response);
              //get lambda functions when connection is saved
              if ($ctrl.view === 'modal') {
                if (typeof $ctrl.modalInstance.close === 'function') {
                  $ctrl.modalInstance.close({ connection: model });
                }
                NotificationService.add('success', 'Connection details are saved successfully.');
              }

              if (typeof $ctrl.onSave === 'function') {
                $ctrl.onSave({ connection: request });
              }
              usSpinnerService.stop('connectionView');
            }

            //end of controller
          }]
      };
    }]);
})();
