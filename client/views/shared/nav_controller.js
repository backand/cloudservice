'use strict';

angular.module('controllers').controller('NavCtrl', [
  '$scope', 'filterFilter',
  function($scope, filterFilter) {
    $scope.taskRemainingCount = 3
  }
]);
