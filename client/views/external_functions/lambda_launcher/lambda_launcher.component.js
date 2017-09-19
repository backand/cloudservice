/**
 * @ngdoc directive
 * @name backand.externalFunctions.directive.lambdaLauncher
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
    .directive('lambdaLauncher', [function () {
      return {
        restrict: 'E',
        scope: {
          appKeys: '='
        },
        templateUrl: 'views/external_functions/lambda_launcher/lambda_launcher.html',
        controllerAs: '$ctrl',
        bindToController: true,
        controller: [
          '$log',
          '$state',
          'APP_CONSTS',
          function ($log, $state, APP_CONSTS) {
            var $ctrl = this;
            $log.warn('Component lambdaLauncher has initialized');

            /**
             *
             * public methods
             */
            /**
             * public properties
             */
            $ctrl.appName = $state.params.appName;
            $ctrl.appConst = APP_CONSTS;
            $ctrl.launcherAppUrl = '';
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
              if (_.get($ctrl.appKeys, 'data')) {
                $ctrl.tokens = $ctrl.appKeys.data;
                $log.info('Current App tokens', $ctrl.tokens);
                if ($ctrl.tokens.anonymous) {
                  $ctrl.launcherAppUrl = $ctrl.appConst.LAUNCHER_APP_URL + '/#/' + $ctrl.appName + '/functions?t=' + $base64.encode($ctrl.tokens.anonymous);
                } else {
                  $ctrl.launcherAppUrl = $ctrl.appConst.LAUNCHER_APP_URL + '/#/' + $ctrl.appName + '/login';
                }
              }
            }

            //end of controller
          }]
      };
    }]);
})();
