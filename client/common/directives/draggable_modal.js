(function () {
  'use strict';

  angular.module('common.directives')
    .directive('draggableModal', function () {
      return {
        restrict: 'A',
        link: function (scope, elem, attr) {
          $('.modal-dialog').draggable();
        }
      }
    });
})();
