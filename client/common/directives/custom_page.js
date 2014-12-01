(function() {
  'use strict';

  angular.module('common.directives.custom_page', [])
    .directive('customPage', function() {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$location','$rootScope',
          function($scope, $element, $location,$rootScope) {
            var path = function() {
              return $location.path();
            };

            var addBg = function(path) {
              // remove all the classes
              $element.removeClass('body-wide body-auth body-err body-lock body-sign_in');

              // add certain class based on path
              switch (path) {
                case '404':
                case 'pages/404':
                case 'pages/500':
                  return $element.addClass('body-wide body-err');
                case 'sign_in':
                case 'sign_up':
                case 'forgot-password':
                case 'change_password':
                  return $element.addClass('body-wide body-auth');
                case 'pages/lock-screen':
                  return $element.addClass('body-wide body-lock');
              }
            };

            addBg($location.path());


            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
              if (toState != fromState) {
                addBg(toState.name);
              }
            });
          }]
      };
    });
})();
