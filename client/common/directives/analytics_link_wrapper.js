(function () {
  'use strict';

  angular.module('common.directives')
    .directive('analyticsWrapper', ['AnalyticsService', function (AnalyticsService) {
      return {
        restrict: 'A',
        scope: {
          target: '='
        },
        link: function (scope, elem, attrs, ctrl) {
          elem.bind('click', function () {
            var target;
            if (attrs.target) {
              target = attrs.target;
            } else {
              target = elem.text().trim();
            }
            AnalyticsService.track(target, {link: target});
          });
        }
      };
    }
    ])

}());
