(function () {
  'use strict';

  angular.module('common.directives')
    .directive('unsavedChanges', function () {
      return {
        restrict: 'EA',
        scope: {
          isUnsaved: '='
        },
        templateUrl: 'common/directives/unsaved_changes/unsaved_changes.html'
      }
    });
})();
