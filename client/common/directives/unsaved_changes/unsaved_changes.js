(function () {
  'use strict';

  angular.module('common.directives')
    .directive('draggableModal', function () {
      return {
        restrict: 'EA',
        scope: {
          isUnsaved: '='
        },
        templateUrl: 'unsaved_changes.html'
      }
    });
})();
