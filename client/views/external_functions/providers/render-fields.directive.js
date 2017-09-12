/**
 * @ngdoc directive
 * @name backand.externalFunctions.directive.renderFields
 * @module backand.externalFunctions
 *
 * @description
 * renderFields
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('backand.externalFunctions')
    .directive("renderFields", [function () {
      return {
        restrict: 'AE',
        template: '<ng-include src="url"></ng-include>',
        link: function link(scope, el, attr) {
          scope.$watch(function () {
            return attr.provider;
          }, function (n, o) {
            if (!n) {
              return;
            }
            scope.url = 'views/external_functions/providers/new/partials/' + n + '-provider.html';
          })
        }
      };
    }]);
})();
