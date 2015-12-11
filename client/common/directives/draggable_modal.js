(function () {
  'use strict';

  angular.module('common.directives')
    .directive('draggableModal', function () {
      return {
        restrict: 'A',
        link: function (scope, elem, attr) {
          console.log('from directive');
          $('.modal-dialog').draggable();
        }
      }
    });
})();
