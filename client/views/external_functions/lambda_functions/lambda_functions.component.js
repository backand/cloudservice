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
          launcherAppUrl: '=', //required,
          lambdaFunctions: '=' //required
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
          function ($log, usSpinnerService, CloudService, NotificationService, $rootScope, $scope, AnalyticsService) {
            var $ctrl = this;
            $log.warn('Component awsConnection has initialized', $ctrl.lambdaFunctions);
            
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
            * call initialization to initialize controllers properties 
            */
            initialization();
            /**
             * @name initialization
             * @description
             * function to initialize properties and call function at very first.
             */
            function initialization() {
              if (_.keys($ctrl.lambdaFunctions).length > 0) {
                //Expand collapsible if lambdaFunctions > 0
                $ctrl.hasFunctions = _.keys($ctrl.lambdaFunctions).length > 0;
                extractAllFunctions($ctrl.lambdaFunctions);
              } else {
                $ctrl.lambdaFunctions = {};
                $ctrl.hasFunctions = false;
              }
            }
            /**
             * @name extractAllFunctions
             * @description extract functions from all regions
             * sets all functions in $ctrl.allFunctions
             * @param {object} response 
             */
            function extractAllFunctions(fns) {
              var functions = fns || [];
              var flatA = _.flattenDeep(_.map(functions, function (a) {
                return a;
              }));

              $ctrl.allFunctions =  flatA;
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
            function updateFunction(func, flag, metaId) {
              $log.info('Selected function - ', func, $ctrl.activeConnection);
              usSpinnerService.spin('loading');
              var cloudId = metaId || _.get($ctrl.activeConnection, '__metadata.id');
              var requestBody;
              if (_.isArray(func)) {
                requestBody = _.map(func, function (f) {
                  return {
                    name: f.FunctionName,
                    cloudId: cloudId,
                    select: flag,
                    arn: f.FunctionArn
                  }
                })
              } else {
                requestBody = [{
                  name: func.FunctionName,
                  cloudId: cloudId,
                  select: flag,
                  arn: func.FunctionArn
                }];
              }
              CloudService
                .updateFunction(requestBody)
                .then(function (response) {
                  updateFunctionIds(func, flag, response.data);
                  $log.info('Lambda function is selected with -', response);
                  usSpinnerService.stop('loading');
                  NotificationService.add('success', 'Function is ' + (flag ? 'linked' : 'Unlinked') + ' successfully');
                  if (flag) {
                    AnalyticsService.track('LambdaFunctionSelected', { function: func.FunctionName });
                  }
                  $rootScope.$broadcast('fetchTables');
                }).catch(function (error) {
                  usSpinnerService.stop('loading');
                  $log.error('Error while updating function\'s status', error);
                });
            }
            /**
             * @name updateFunctionIds
             * @description updates selected and functionId in function Object
             * 
             * @param {object} func 
             * @param {boolean} flag 
             * @param {object} response 
             */
            function updateFunctionIds(func, flag, response) {
              if (_.isArray(func)) {
                _.forEach(func, function (f) {
                  var updatedF = _.find(response, { 'name': f.FunctionName });
                  if (updatedF.functionId > 0) {
                    f.selected = updatedF.select;
                    f.functionId = updatedF.functionId;
                  }
                })
              } else {
                func.selected = response[0]['select'];
                func.functionId = response[0]['functionId'];
              }
            }
            /**
             * @name selectThreeFunctions
             * @description An helper function which calls updateFunctionIds to update functions
             * 
             * @param {object} response 
             * @param {boolean} flag 
             * @param {integer} metaId 
             */
            function selectThreeFunctions(response, flag, metaId) {
              var functions = response.data.data[0] ? response.data.data[0].functions : [];
              var flatA = _.flattenDeep(_.map(functions, function (a) {
                return a;
              }));
              var firstThreeFn = _.take(flatA, 3);
              updateFunction(firstThreeFn, true, metaId);
            }


            /**
             * Listen event from $rootScope
             */
            var unregisterEvent = $rootScope.$on('EVENT:EXTERNAL_FUNCTION:LOAD_LAMBDA_FUNCTIONS', function (event, data) {
              $log.info('Captured EVENT:EXTERNAL_FUNCTION:LOAD_LAMBDA_FUNCTIONS with - ', data);
              getLambdaFunctions();
            });
            var unregisterSelectFnEvent = $rootScope.$on('EVENT:EXTERNAL_FUNCTION:SELECT_FUNCTIONS', function (event, data) {
              selectThreeFunctions(data.functions, true, data.metaDataId);
            });
            /**
             * destroy event on scope destroy
             */
            $scope.$on('$destroy', function () {
              unregisterEvent();
              unregisterSelectFnEvent();
            });

            //end of controller
          }]
      };
    }]);
})();
