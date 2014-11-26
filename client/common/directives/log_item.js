(function() {
  'use strict';

  angular.module('common.directives',[])
    .directive('logItem', ['$rootScope', function($rootScope) {
      return {
        restrict: 'A',
        scope: {},
        replace : true,
        templateUrl: 'common/directives/log_item/log_item.html',
        link: function(scope, element, attrs) {

        }
      };
    }
  ])

}());



