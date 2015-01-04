(function  () {
  'use strict';
  angular.module('app')
    .controller('SingleTableShow', ['$scope', '$state', 'AppsService', 'usSpinnerService', 'NotificationService', 'ColumnsService','$timeout', '$log', SingleTableShow]);

  function SingleTableShow($scope, $state, AppsService, usSpinnerService, NotificationService, ColumnsService, $timeout, $log) {

    var self = this;
    var currentApp;
    self.tableName = $state.params.tableName;
    self.messages = ["no stats yet..."];
    self.alertClass = "";
    $scope.fields = [];
    $scope.fieldTypesRange = ["String", "DateTime", "Integer"];


    $scope.switchTab = function(tab) {
      ColumnsService.get($state.params.name, $state.params.tableName)
      .then(function(data) {
        $scope.fields = data.data.fields;
      },
      function(err) {
        NotificationService.add('error', 'Can not get table info');
      }
    );
    };

    $scope.selectedField = null;
    $scope.showField = function(field) {
      $scope.selectedField = field;
    };

  }
}());
