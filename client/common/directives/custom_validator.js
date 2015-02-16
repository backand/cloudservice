(function() {
  'use strict';

  angular.module('common.directives')
    .directive('customValidator', function() {
      return {
        require: 'ngModel',
        scope: {
          validator: '=customValidator'
        },
        link: function(scope, elem, attrs, ngModel) {
          ngModel.$validators[scope.validator.name] = function(modelValue, viewValue) {
            return scope.validator.validate(modelValue);
          }
        }
      };
    })
}());
