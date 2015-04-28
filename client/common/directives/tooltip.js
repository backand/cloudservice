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
      template: '<i class="ti-info-alt" tooltip="{{ tooltipText | translate}}" tooltip-placement="{{tooltipPlacement}}" tooltip-append-to-body="true"></i>'
    };
  }

  angular.module('common.directives')
    .directive('baTooltip', ['$translate', baTooltip]);
})();
