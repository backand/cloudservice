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
        $scope.dictionaryItems = $scope.anchorParams.getDictionaryItems();
      },
      templateUrl: 'common/directives/anchor/anchor.html'
    };
  }

  angular.module('app')
    .directive('bkndAnchor', bkndAnchor);
})();
