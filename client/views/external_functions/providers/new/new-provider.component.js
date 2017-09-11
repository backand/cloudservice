/**
 * @ngdoc directive
 * @name backand.externalFunctions.directive.newProvider
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
    .directive('newProvider', [function () {
      return {
        restrict: 'E',
        scope: {
          onSelectProvider: '&',
          modalInstance: '=?', //required if view is modal -in other words - required if this component is opened up in modal,
          options: '=?'
        },
        templateUrl: 'views/external_functions/providers/new/new-provider.html',
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
          'AnalyticsService',
          '$rootScope',
          function ($log, usSpinnerService, CloudService, NotificationService, $q, ConfirmationPopup, $state, AnalyticsService, $rootScope) {
            $log.info('Component awsConnection has initialized');
            var $ctrl = this,
              regions,
              cloudProviderModel = {
                AccessKeyId: '',
                AwsRegion: [],
                accountId: '',
                Name: 'Main',
                CloudVendor: 'AWS',
                EncryptedSecretAccessKey: ''
              },
              cloudProviderTypes = [{
                name: 'AWS',
                key: 'aws',
                description: 'AWS Lambda',
                enable : true
              }, {
                name: 'Azure',
                key: 'azure',
                description: 'Azure Functions',
                enable : false
              }, {
                name: 'Google',
                key: 'google',
                description: 'Google Functions',
                enable : false
              }, {
                name: 'IBM',
                key: 'ibm',
                description: 'IBM OpenWisk',
                enable : false
              }],
              defaultSecretKeyHas = '************';

            /**
             *
             * public methods
             */
            $ctrl.saveProvider = saveProvider;
            $ctrl.loadRegion = loadRegion;
            $ctrl.deleteProvider = deleteProvider;
            $ctrl.selectProvider = selectProvider;
            /**
             * public properties
             */
            $ctrl.cloudProvider = angular.copy(cloudProviderModel);
            $ctrl.cloudProviderTypes = angular.copy(cloudProviderTypes);

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
              regions = _.get($ctrl.options, 'regions') || [];
              $ctrl.isNew = $ctrl.options.isNew;

              var p = _.get($ctrl.options, 'provider');
              if (p && p.Id) {
                setProvider(p);
                var pType = _.find($ctrl.cloudProviderTypes, function (pt) {
                  return pt.name.toLowerCase() === p.CloudVendor.toLowerCase();
                });
                selectProvider(pType);
              } else if ($ctrl.isNew) {
                selectProvider($ctrl.cloudProviderTypes[0]);
              }
              $ctrl.modalInstance = $ctrl.modalInstance || {};
            }

            /**
             * @name loadRegion
             * @description gets aws regions
             * stores to $ctrl.regions
             * 
             * @returns void
             */
            function loadRegion() {
              var deferred = $q.defer();
              deferred.resolve(regions);
              return deferred.promise;
            }

            /**
             * @name setProvider
             * @description update provider model
             * store connection details in $ctrl.cloudProvider
             * 
             * @param {any} provider
             * @returns void
             */
            function setProvider(provider) {
              var clp = provider || angular.copy(cloudProviderModel);
              if (!_.isEmpty(clp.AccessKeyId)) {
                clp.EncryptedSecretAccessKey = defaultSecretKeyHas;
              }
              $ctrl.cloudProvider = clp;
            }

            /**
             * @name saveProvider
             * @description  function to save connection details
             * validate credentials on client side before send to API
             * 
             * @returns void
             */
            function saveProvider() {
              usSpinnerService.spin('connectionView');
              $log.info('saveProvider is called with :', $ctrl.cloudProvider);
              var request = angular.copy($ctrl.cloudProvider);
              if (request.__metadata) {
                request.id = request.__metadata.id;
              }
              request = _.chain(request)
                .pick(['AccessKeyId', 'AwsRegion', 'CloudVendor', 'EncryptedSecretAccessKey', 'id', 'Name'])
                .pick(function (v, k) {
                  return v ? true : false;
                })
                .value();

              if (request.EncryptedSecretAccessKey === defaultSecretKeyHas) {
                delete request.EncryptedSecretAccessKey;
              }
              request.CloudVendor = $ctrl.selectedProvider.name;
              request.AwsRegion = _.map(request.AwsRegion, 'Code').join(',');
              $log.warn('Connection request', request);
              CloudService
                .saveProvider(request)
                .then(function (response) {
                  $log.info('Connection details are saved', response);
                  CloudService
                    .getLambdaFunctions()
                    .then(function (functions) {
                      NotificationService.add('success', 'Connection details are saved successfully.');
                      AnalyticsService.track('AWSConnectionSaved');
                      if (!request.id) {
                        console.log('Is new Event ---', $ctrl.isNew);
                        if ($ctrl.isNew) {
                          $rootScope.$emit('EVENT:EXTERNAL_FUNCTION:SELECT_FUNCTIONS', {
                            functions: functions,
                            metaDataId: response.data.__metadata.id
                          });
                        }
                      }
                      handler(response, request, $ctrl.cloudProvider, true);
                    }, function () {
                      NotificationService.add('error', 'Provided AWS credentials are not valid.');
                      handler({}, request, $ctrl.cloudProvider, false);
                    });

                })
                .catch(function (error) {
                  $log.error('Error while saving conncetions detail', error);
                  handler({}, request, $ctrl.cloudProvider);
                });
            }

            function handler(response, request, model, status) {
              $ctrl.isNewConnection = !request.id ? true : false;
              //get lambda functions when connection is saved
              if (typeof $ctrl.modalInstance.close === 'function' && !_.isEmpty(response)) {
                $ctrl.modalInstance.close({ connection: model });
              }
              $rootScope.$emit('EVENT:RELOAD_PROVIDER');
              usSpinnerService.stop('connectionView');
            }

            /**
             * @function
             * @name selectProvider
             * @description Select Cloud Provider type
             * @param {any} provider 
             */
            function selectProvider(provider, flag) {
              /*if (!$ctrl.isNew && flag) {
                return;
              }*/
              if(!provider.enable){
                return;
              }

              $ctrl.selectedProvider = angular.copy(provider);
              if (typeof $ctrl.onSelectProvider === 'function') {
                $ctrl.onSelectProvider({
                  provider: $ctrl.selectedProvider
                });
              }
            }
            /**
             * @description An helper function, trigger event which is captured in providersList component
             * @param {any} provider 
             */
            function deleteProvider(provider) {
              $rootScope.$emit('EVENT:DELETE_PROVIDER', {
                provider: $ctrl.cloudProvider
              });
            }
            //end of controller
          }]
      };
    }]);
})();
