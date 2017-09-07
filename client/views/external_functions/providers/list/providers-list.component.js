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
          function ($log, usSpinnerService, CloudService, NotificationService, $q, ConfirmationPopup, $state, AnalyticsService) {
            $log.info('Component awsConnection has initialized');
            var $ctrl = this;
            /**
            * call initialization to initialize controllers properties 
            */
            initialization();

            /**
             *
             * public methods
             */
            $ctrl.deleteProvider = deleteProvider;

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
              spinner(true);
              getProviders();
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
                  $ctrl.providers = angular.copy(response.data.data);
                  /* var awsConnection = response.data.data[0] || angular.copy(connectionModel),
                     regionsCode = _.words(awsConnection.AwsRegion, /[^,]+/g);
 
                   awsConnection.AwsRegion = _.filter($ctrl.regions, function (r) {
                     return _.indexOf(regionsCode, r.Code) >= 0;
                   });
                   if (!_.isEmpty(awsConnection.AccessKeyId)) {
                     awsConnection.EncryptedSecretAccessKey = defaultSecretKeyHas;
                   }*/
                  $log.info('providers loaded', response);
                  spinner(false);
                }).catch(function (error) {
                  $log.error('Error while fetching providers', error);
                  spinner(false);
                });
            }

            function deleteProvider(id) {
              ConfirmationPopup.confirm('Are sure you want to delete this provider?')
                .then(function (result) {
                  if (result) {
                    spinner(true);
                    CloudService
                      .deleteProvider(id)
                      .then(function (response) {
                        NotificationService.add('success', 'provider has been deleted successfully.');
                        $log.info('provider has been deleted', response);
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
             * helper function to start/stop spinner
             * @description 
             * @param {any} flag 
             */
            function spinner(flag) {
              flag ? usSpinnerService.spin('providersList') : usSpinnerService.stop('providersList');
            }
            //end of controller
          }]
      };
    }]);
})();
