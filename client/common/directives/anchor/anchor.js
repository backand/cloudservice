(function() {
  'use strict';

  function bkndAnchor() {
    return {
      restrict: 'E',
      transclude : true,
      scope: {
        anchorParams: '=',
        inputId: '@',
        windowTitle: '@',
        prevNeeded: '=?'
      },
      controller: function ($scope) {
        $scope.dictionaryItems = $scope.anchorParams.dictionaryItems;
      },
      templateUrl: 'common/directives/anchor/anchor.html'
    };
  }

  angular.module('common.directives')
    .directive('bkndAnchor', bkndAnchor);
})();
