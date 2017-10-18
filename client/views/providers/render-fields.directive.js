/**
 * @ngdoc directive
 * @name backand.externalFunctions.directive.renderPartial
 * @module backand.externalFunctions
 *
 * @description
 * renderPartial
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('backand.externalFunctions')
    .directive("renderPartial", [function () {
      return {
        restrict: 'E',
        scope : true,
        template: '<ng-include src="url"></ng-include>',
        link: function link(scope, el, attr) {
          if (!attr.path) {
            console.error('Directive: renderPartial - path attribute is missing');
            return;
          }
          var path = attr.path || '',
            postfix = attr.postfix || '';
          scope.$watch(function () {
            return attr.view;
          }, function (n, o) {
            if (!n) {
              return;
            }
            scope.url = (attr.path + n + postfix + '.html').toLowerCase();
          })
        }
      };
    }]);
})();
