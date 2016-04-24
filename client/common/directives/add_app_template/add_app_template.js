(function () {
  'use strict';

  angular.module('common.directives')
    .directive('addAppTemplate', function () {
      return {
        restrict: 'EA',
        templateUrl: 'common/directives/add_app_template/add_app_template.html'
      };
    })

}());
