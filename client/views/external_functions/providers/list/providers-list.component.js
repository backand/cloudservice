/**
 * @ngdoc directive
 * @name backand.externalFunctions.directive.providersList
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
    .directive('providersList', [function () {
      return {
        restrict: 'E',
        scope: {
          onSave: '&', // optional
          view: '@', //optional,
          modalInstance: '=?', //required if view is modal -in other words - required if this component is opened up in modal,
          onLoadConnection: '&?', //optional
          isNew: '=?'
        },
        require: '^externalFunctions',
        templateUrl: 'views/external_functions/providers/list/providers-list.html',
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
          'modalService',
          '$rootScope',
          '$scope',
          function ($log, usSpinnerService, CloudService, NotificationService, $q, ConfirmationPopup, $state, AnalyticsService, modalService, $rootScope, $scope) {
            $log.info('Component awsConnection has initialized');
            var $ctrl = this, regions;
            /**
            * call initialization to initialize controllers properties 
            */
            initialization();

            /**
             *
             * public methods
             */
            $ctrl.deleteProvider = deleteProvider;
            $ctrl.showProviderModal = showProviderModal;

            /**
             * public properties
             */
            $ctrl.accordions = [];
            /**
             * @name initialization
             * @description
             * function to initialize properties and call function at very first.
             */
            function initialization() {
              $log.info('ProviderList component');
              getLambdaFunctions();
              listenEvents();
              spinner(true);
              loadRegions();
            }
            /**
            * @name getLambdaFunctions
            * @description  function to get lambda function by app
            * 
            * @returns void
            */
            function getLambdaFunctions() {
              spinner(true);
              CloudService
                .getLambdaFunctions()
                .then(function (response) {
                  $log.info(response.data);
                  $ctrl.providers = _.get(response, 'data.data') || [];
                  $ctrl.accordions.length = $ctrl.providers.length;
                  $log.warn('Lambda functions loaded', response);
                  spinner(false);
                  if ($ctrl.providers.length === 0) {
                    showProviderModal();
                  }
                  if ($ctrl.providers.length === 1) {
                    $ctrl.accordions[0] = true;
                  }
                }).catch(function (error) {
                  $log.error('Error while fetching Lambda functions', error);
                  spinner(false);
                });
            }

            function loadRegions() {
              CloudService
                .loadRegion()
                .then(function (response) {
                  $log.info('All regions', response.data);
                  regions = response.data;
                });
            }

            /**
             * @description 
             * @param {any} provider 
             * @param {any} $event 
             */
            function deleteProvider(provider, $event) {
              if ($event) {
                $event.stopImmediatePropagation();
              }
              var id = provider.id || provider.Id;
              ConfirmationPopup.confirm('Are sure you want to delete <strong>' + (provider.name || provider.Name) + '</strong> provider?')
                .then(function (result) {
                  if (result) {
                    spinner(true);
                    CloudService
                      .deleteProvider(id)
                      .then(function (response) {
                        NotificationService.add('success', 'Provider has been deleted successfully.');
                        $log.info(id + ' - provider has been deleted', response);
                        $rootScope.$emit('EVENT:RELOAD_PROVIDER');
                        if ($ctrl.modal && $ctrl.modal.hasOwnProperty('close')) {
                          $ctrl.modal.close();
                        }
                        spinner(false);
                      }).catch(function (error) {
                        $log.error('Error while deleting a provider', error);
                        spinner(false);
                      });
                  }
                });
            }

            /**
             * @function
             * @name showProviderModal
             * @description launch modal to add/update provider's connection details
             * @param {any} provider 
             * @param {any} $event 
             */
            function showProviderModal(provider, $event) {
              $log.info('Provider connection - ', provider);
              if ($event) {
                $event.stopImmediatePropagation();
              }

              if (provider) {
                spinner(true);
                CloudService.getProvider({
                  id: provider.id
                }).then(function (response) {
                  var p = _.get(response, 'data');
                  var regionsCode = _.words(p.AwsRegion, /[^,]+/g);
                  p.AwsRegion = _.filter(regions, function (r) {
                    return _.indexOf(regionsCode, r.Code) >= 0;
                  });
                  openModal(p);
                  spinner(false);
                }).catch(function () {
                  spinner(false);
                });
                return;
              }
              openModal(provider);
            }

            function openModal(provider) {
              $ctrl.modal = modalService
                .cloudProvider({
                  type: provider ? (provider.CloudVendor || provider.cloudVendor) : 'aws',
                  resolve: {
                    options: function () {
                      return {
                        isNew: provider ? false : true,
                        provider: provider,
                        regions: regions
                      }
                    }
                  }
                });

              $ctrl.modal.result.then(function (response) {
                $log.info('Component-ProviderList: addProvider -', response);
              }).catch(function (error) {
                $log.info('Component-ProviderList: addProvider - Cancel', error);
              });
            }

            /**
             * helper function to start/stop spinner
             * @description 
             * @param {any} flag 
             */
            function spinner(flag) {
              flag ? usSpinnerService.spin('loading') : usSpinnerService.stop('loading');
            }

            /**
             * @function
             * @name listenEvents
             * @description An helper function to listen event and unregister
             */
            function listenEvents() {
              var addProviderEvent = $rootScope.$on('EVENT:ADD_PROVIDER', function () {
                showProviderModal();
              });
              var deleteProviderEvent = $rootScope.$on('EVENT:DELETE_PROVIDER', function (event, data) {
                deleteProvider(data.provider);
              });
              var reloadProvidersEvent = $rootScope.$on('EVENT:RELOAD_PROVIDER', function (event, data) {
                getLambdaFunctions();
              });
              $scope.$on('$destroy', function () {
                //unregistered event when component is destroyed
                addProviderEvent();
                deleteProviderEvent();
                reloadProvidersEvent();
              });
            }
            //end of controller
          }]
      };
    }]);
})();
