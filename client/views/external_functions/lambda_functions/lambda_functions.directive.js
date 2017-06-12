/**
 * @ngdoc directive
 * @name backand.externalFunctions.directive.lambdaFunctions
 * @module backand.externalFunctions
 *
 * @description
 * manage lambda functions by provided credentials
 *
  * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('backand.externalFunctions')
    .directive('lambdaFunctions', [function () {
      return {
        restrict: 'E',
        scope: {
          onLoad: '&', // optional
          activeConnection: '=', //required
        },
        templateUrl: 'views/external_functions/lambda_functions/lambda_functions.html',
        controllerAs: '$ctrl',
        bindToController: true,
        controller: [
          '$log',
          'usSpinnerService',
          'CloudService',
          'NotificationService',
          '$rootScope',
          '$scope',
          'AnalyticsService',
          function ($log, usSpinnerService, CloudService, NotificationService, $rootScope, $scope,AnalyticsService) {
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
            $ctrl.updateFunction = updateFunction;
            /**
             * public properties
             */
            $ctrl.hasFunctions = false;
            /**
             * @name initialization
             * @description
             * function to initialize properties and call function at very first.
             */
            function initialization() {
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
                  $log.info(response.data);
                  $ctrl.lambdaFunctions = response.data.data[0] ? response.data.data[0].functions : [];
                  //Expand collapsible if lambdaFunctions > 0
                  $ctrl.hasFunctions = _.keys($ctrl.lambdaFunctions).length > 0;

                  //invoke callback
                  if (typeof $ctrl.onLoad === 'function') {
                    $ctrl.onLoad({
                      functions: angular.copy($ctrl.lambdaFunctions),
                      hasFunctions: $ctrl.hasFunctions
                    });
                  }
                  $log.info('Lambda functions loaded', response);
                  usSpinnerService.stop('loading');
                }).catch(function (error) {
                  $ctrl.lambdaFunctions = {};
                  $ctrl.hasFunctions = false;
                  $log.error('Error while fetching Lambda functions', error);
                  usSpinnerService.stop('loading');
                });
            }

            /**
             * @name updateFunction
             * @description updates function with selected:true|false
             * Link/unkink function 
             * link - {
             *  selected : true
             * }
             * 
             * unlink - {
             *  selected : false
             * }
             * 
             * @param {string} func A function to be updated
             * @param {boolean} flag A flag true|false 
             * 
             * @returns void
             */
            function updateFunction(func, flag) {
              $log.info('Selected function - ', func, $ctrl.activeConnection);
              usSpinnerService.spin('loading');
              var requestBody = {
                name: func.FunctionName,
                cloudId: $ctrl.activeConnection.__metadata.id,
                select: flag,
                arn: func.FunctionArn
              };
              CloudService
                .updateFunction(requestBody)
                .then(function (response) {
                  func.selected = flag;
                  func.functionId = response.data[0]['functionId'];
                  $log.info('Lambda function is selected with -', response);
                  usSpinnerService.stop('loading');
                  NotificationService.add('success', 'Function is ' + (flag ? 'linked' : 'Unlinked') + ' successfully');

                  if (flag) {
                    AnalyticsService.track('LambdaFunctionSelected', { function: func.FunctionName });
                  }
                  $rootScope.$broadcast('fetchTables');
                  getLambdaFunctions();
                }).catch(function (error) {
                  usSpinnerService.spin('loading');
                  $log.error('Error while updating function\'s status', error);
                });
            }


            /**
             * Listen event from $rootScope
             */
            var unregisterEvent = $rootScope.$on('EVENT:EXTERNAL_FUNCTION:LOAD_LAMBDA_FUNCTIONS', function (event, data) {
              $log.info('Captured EVENT:EXTERNAL_FUNCTION:LOAD_LAMBDA_FUNCTIONS with - ', data);
              getLambdaFunctions();
            });
            /**
             * destroy event on scope destroy
             */
            $scope.$on('$destroy', function () {
              unregisterEvent();
            });

            //end of controller
          }]
      };
    }]);
})();
