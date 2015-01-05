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
    $scope.excluded=true;
    $scope.fields = [];
    $scope.fieldTypesRange = ["String", "DateTime", "Integer"];


    $scope.switchTab = function (tab) {
      ColumnsService.get($state.params.name, $state.params.tableName)
        .then(function (data) {
          $scope.fields = data.data.fields;
        },
        function (err) {
          NotificationService.add('error', 'Can not get table info');
        }
      );
    };

    $scope.selectedField = null;
    $scope.showField = function (field) {
      $scope.selectedField = field;
    };
    self.sumbitForm = function () {
      self.loading = true;
      try {
        ColumnsService.update(self.appName, self.appTitle)
          .success(function (data) {
            NotificationService.add('success', 'Application settings updated successfully');
            self.loading = false;
          })
          .error(function (err) {
            NotificationService.add('Error', 'waiting for Relly Rivlin');
            self.loading = false;
          })

      }
      catch (ex) {
        NotificationService.add('Error', 'waiting for Relly Rivlin');
      }
    }
  }
}());
