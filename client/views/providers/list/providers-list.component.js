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
          onLoad: '&?', //optional
          isNew: '=?',
          launcherAppUrl: '=',
          type: '=?'
        },
        require: '^externalFunctions',
        templateUrl: 'views/providers/list/providers-list.html',
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
            var $ctrl = this, regions, skipModal = false, STORAGE = 'storage', DEFALT_ICON_TYPE = 'aws';
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
            $ctrl.getProviderIcon = getProviderIcon;

            /**
             * public properties
             */
            $ctrl.accordions = [];
            $ctrl._ = _;
            $ctrl.isStorage = isStorage();
            /**
             * @name initialization
             * @description
             * function to initialize properties and call function at very first.
             */
            function initialization() {
              $log.info('ProviderList component', $ctrl.type);
              getProviders();
              listenEvents();
              spinner(true);
              loadRegions();
            }
            /**
            * @name getProviders
            * @description  function to get lambda function by app
            * @param {any} provider
            * @returns void
            */
            function getProviders(provider) {
              spinner(true);
              var resource;
              if (isStorage()) {
                resource = CloudService
                  .getProviders({
                    filter: [{ fieldName: 'Type', operator: 'equals', value: "Storage" }]
                  });
              } else {
                resource = CloudService.getLambdaFunctions();
              }
              resource.then(function (response) {
                $log.info(response.data);
                spinner(false);
                if (isStorage()) {
                  var ps = _.get(response, 'data.data') || [];
                  ps = _.map(ps, function (p) {
                    p.name = p.Name;
                    p.id = p.Id;
                    delete p.Id;
                    delete p.Name;
                    return p;
                  });
                  $ctrl.providers = ps;
                } else {
                  $ctrl.providers = _.get(response, 'data.data') || [];
                  $ctrl.accordions.length = $ctrl.providers.length;
                  $log.warn('Lambda functions loaded', response);
                  if ($ctrl.providers.length === 0 && !skipModal && !$ctrl.isNew) {
                    skipModal = true;
                    showProviderModal();
                  }
                  if ($ctrl.providers.length === 1) {
                    $ctrl.accordions[0] = true;
                  } else if ($ctrl.providers.length > 1 && provider) {
                    _.forEach($ctrl.providers, function (p, idx) {
                      if (p.id == provider) {
                        $ctrl.accordions[idx] = true;
                        return false;
                      }
                    });
                  }
                }
                if (_.isFunction($ctrl.onLoad)) {
                  $ctrl.onLoad({
                    providers: angular.copy($ctrl.providers)
                  });
                }
              }).catch(function (error) {
                $ctrl.providers = [];
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
                        skipModal = false;
                        $rootScope.$broadcast('fetchTables');
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
                var params = {
                  id: provider.id
                };
                if (isStorage()) {
                  params['filter'] = [{ fieldName: 'Type', operator: 'equals', value: "Storage" }];
                }
                spinner(true);
                CloudService.getProvider(params).then(function (response) {
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
                        regions: regions,
                        type: $ctrl.type
                      }
                    }
                  }
                });

              $ctrl.modal.result.then(function (response) {
                $log.info('Component-ProviderList: addProvider -', response);
                var providerId = _.get(response, 'data.__metadata.id');
                if (providerId) {
                  $ctrl.accordions[$ctrl.accordions.length + 1] = true;
                }
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
            * @description An helper function which checks if provider type is Storage
            * @returns {boolean}
            */
            function isStorage() {
              return $ctrl.type && $ctrl.type.toLowerCase() === STORAGE;
            }
            /**
             * @function
             * @name getProviderIcon
             * @description An helper function which returns icon path based on provider type[aws|google|amazon|azure]
             * @param {any} provider
             * @returns {string} 
             */
            function getProviderIcon(provider) {
              var type =  $ctrl.type && $ctrl.type.toLowerCase() === 'storage' ? 'storage' : '' ;
              var iconType;
              if (provider.hasOwnProperty('cloudVendor')) {
                iconType = typeof provider.cloudVendor === 'string' ? provider.cloudVendor.toLowerCase() : DEFALT_ICON_TYPE;
              } else if (provider.hasOwnProperty('CloudVendor')) {
                iconType = typeof provider.CloudVendor === 'string' ? provider.CloudVendor.toLowerCase() : DEFALT_ICON_TYPE;
              } else {
                iconType = DEFALT_ICON_TYPE;
              }
              return 'assets/images/icons/' + iconType + '-'+ (type ? type+'-' : '') +'icon.png';
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
                var provider = _.get(data, 'provider');
                getProviders(provider);
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
