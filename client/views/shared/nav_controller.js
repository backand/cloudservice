'use strict';

angular.module('controllers').controller('NavCtrl', [
  '$rootScope','$scope', 'filterFilter',
  function($rootScope,$scope, filterFilter) {
    $scope.taskRemainingCount = 3

  }
]);
