(function() {
  'use strict';

  angular.module('common.directives')
    .directive('baNestedContainer', ['$compile', baNestedContainer])
    .directive('baNestedNode', ['$compile', baNestedNode]);


  function baNestedContainer ($compile) {
    return {
      scope: {
        container: '='
      },
      replace: true,
      template: '',
      link: function (scope, element, attrs) {
        if (!scope.container) return;

        if (angular.isArray(scope.container)) {
          element.append('<ul><li ng-repeat="node in container" ba-nested-node node="node" parent="array"></li></ul>');

        } else if (angular.isObject(scope.container)) {
          element.append('<span ng-repeat="(key, node) in container">' +
            '{{ key | newTerminology }}: ' +
            '<ba-nested-node node="node" parent="object"></ba-nested-node>' +
            '{{$last ? "" : ", "}} </span>');

        } else {
          element.append('{{ container | newTerminology }}');
        }
        $compile(element.contents())(scope)
      }
    };
  }


  function baNestedNode ($compile) {
    return {
      scope: {
        node: '=',
        parent: '@'
      },
      template: '',
      link: function (scope, element, attrs) {
        if (!scope.node) return;

        if (angular.isArray(scope.node)) {
          element.append('<ba-nested-container container="node"></ba-nested-container>');

        } else if (angular.isObject(scope.node)) {
            if (scope.parent === 'object') {
              element.append('<ul><li><ba-nested-container container="node"></ba-nested-container></li></ul>');
            }
            else {
              element.append('<ba-nested-container container="node"></ba-nested-container>');
            }

        } else {
          element.append('<span>{{ node | newTerminology }}</span>');
        }
        $compile(element.contents())(scope)

      }
    };
  }

}());
