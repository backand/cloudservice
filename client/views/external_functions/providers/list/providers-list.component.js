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
            /**
             * @name initialization
             * @description
             * function to initialize properties and call function at very first.
             */
            function initialization() {
              $log.info('ProviderList component');
              listenEvents();
              spinner(true);
              getProviders();
              loadRegions();
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
             * @name getProviders
             * @description fetchs AWS connection details for a application
             * store connection details in $ctrl.aws
             * 
             * @returns void
             */
            function getProviders() {
              CloudService
                .getProviders()
                .then(function (response) {
                  var providers = _.get(response, 'data.data') || [];
                  $ctrl.providers = _.map(providers, function (p) {
                    var regionsCode = _.words(p.AwsRegion, /[^,]+/g);
                    p.AwsRegion = _.filter(regions, function (r) {
                      return _.indexOf(regionsCode, r.Code) >= 0;
                    });
                    return p;
                  });
                  $log.info('providers loaded', response);
                  spinner(false);
                  if (providers.length === 0) {
                    showProviderModal();
                  }
                }).catch(function (error) {
                  $log.error('Error while fetching providers', error);
                  spinner(false);
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
              ConfirmationPopup.confirm('Are sure you want to delete <strong>' + provider.Name + '</strong> provider?')
                .then(function (result) {
                  if (result) {
                    spinner(true);
                    CloudService
                      .deleteProvider(provider.Id)
                      .then(function (response) {
                        NotificationService.add('success', 'Provider has been deleted successfully.');
                        $log.info(provider.Name + ' - provider has been deleted', response);
                        $state.reload();
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
              if ($event) {
                $event.stopImmediatePropagation();
              }
              $log.info('Provider connection - ', provider);
              modalService
                .cloudProvider({
                  resolve: {
                    options: function () {
                      return {
                        isNew: provider ? false : true,
                        provider: provider,
                        regions: regions
                      }
                    }
                  }
                }).then(function (response) {
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
              flag ? usSpinnerService.spin('providersList') : usSpinnerService.stop('providersList');
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
              $scope.$on('$destroy', function () {
                //unregistered event when component is destroyed
                addProviderEvent();
                deleteProviderEvent();
              });
            }
            //end of controller
          }]
      };
    }]);
})();
