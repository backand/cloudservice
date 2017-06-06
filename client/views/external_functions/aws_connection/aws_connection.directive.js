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
          modalInstance: '=?', //required if view is modal -in other words - required if this component is opened up in modal,
          onLoadConnection: '&?' //optional
        },
        templateUrl: 'views/external_functions/aws_connection/aws_connection.html',
        controllerAs: '$ctrl',
        bindToController: true,
        controller: [
          '$log',
          'usSpinnerService',
          'CloudService',
          'NotificationService',
          '$q',
          'ConfirmationPopup',
          '$state',
          function ($log, usSpinnerService, CloudService, NotificationService, $q, ConfirmationPopup,$state) {
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
            $ctrl.loadAwsRegion = loadAwsRegion;
            $ctrl.deleteConnection = deleteConnection;

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
              var deferred = $q.defer();
              CloudService
                .loadAwsRegion()
                .then(function (response) {
                  $log.info('All regions', response.data);
                  $ctrl.regions = response.data;
                  deferred.resolve(response.data);
                });
              return deferred.promise;
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
                  var awsConnection = response.data.data[0] || angular.copy(connectionModel),
                  regionsCode = _.words(awsConnection.AwsRegion, /[^,]+/g);

                  awsConnection.AwsRegion = _.filter($ctrl.regions, function(r){
                    return _.indexOf(regionsCode, r.Code) >= 0;
                  });
                 
                  $ctrl.aws = awsConnection;
                  //trigger bindings
                  if (typeof $ctrl.onLoadConnection === 'function') {
                    $ctrl.onLoadConnection({
                      connection: awsConnection
                    });
                  }
                  $log.info('Connections credentials loaded', response);
                  usSpinnerService.stop('connectionView');
                }).catch(function (error) {
                  $log.error('Error while fetching connection details', error);
                  usSpinnerService.stop('connectionView');
                });
            }

            function deleteConnection(id){
                ConfirmationPopup.confirm('Are sure you want to delete AWS connection?')
                .then(function (result) {
                  if (result) {
                    usSpinnerService.spin('connectionView');
                      CloudService
                        .deleteAwsConnection(id)
                        .then(function (response) {
                          NotificationService.add('success', 'Connection has been deleted successfully.');
                          $log.info('Connection has been deleted', response);
                          $state.reload();
                          usSpinnerService.stop('connectionView');
                        }).catch(function (error) {
                          $log.error('Error while deleting a connection', error);
                          usSpinnerService.stop('connectionView');
                        });
                    }
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
              request.AwsRegion = _.map(request.AwsRegion, 'Code').join(',');
              $log.warn('Connection request', request);
              CloudService
                .saveAwsConnection(request)
                .then(function (response) {
                  $log.info('Connection details are saved', response);
                  NotificationService.add('success', 'Connection details are saved successfully.');
                  handler(response, request, $ctrl.aws);
                })
                .catch(function (error) {
                  $log.error('Error while saving conncetions detail', error);
                  handler({}, request, $ctrl.aws);
                });
            }

            function handler(response, request, model) {
              getAwsConnection();
              //get lambda functions when connection is saved
              if ($ctrl.view === 'modal') {
                if (typeof $ctrl.modalInstance.close === 'function') {
                  $ctrl.modalInstance.close({ connection: model });
                }
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
