(function() {
  'use strict';

  function baTooltip(translate) {
    return {
      restrict: 'E',
      scope: {
        tooltipText: '@',
        tooltipPlacement: '@?'
      },
      controller: function ($scope) {
        $scope.tooltipPlacement = $scope.tooltipPlacement || 'top';
      },
      template: '<i class="ti-info" tooltip="{{ tooltipText | translate}}" tooltip-placement="{{tooltipPlacement}}"></i>'
    };
  }

  angular.module('app')
    .directive('baTooltip', ['$translate', baTooltip]);
})();
