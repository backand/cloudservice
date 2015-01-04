(function  () {
  'use strict';
  angular.module('app')
    .controller('SingleTableShow', [
      '$scope',
      '$state',
      'AppsService',
      'usSpinnerService',
      'NotificationService',
      'ColumnsService',
      '$timeout',
      '$log',
      SingleTableShow]);

  function SingleTableShow($scope,
                           $state,
                           AppsService,
                           usSpinnerService,
                           NotificationService,
                           ColumnsService,
                           $timeout,
                           $log)
  {

    var self = this;

    self.tableName = $state.params.tableName;
    self.messages = ["no stats yet..."];
    self.alertClass = "";

    self.fields = [];
    self.fieldTypesRange = ["String", "DateTime", "Integer"];


    self.switchTab = function(tab) {

      ColumnsService.get($state.params.name, $state.params.tableName)
      .then(function(data) {
        self.fields = data.data.fields;
      },

      function() {
        NotificationService.add('error', 'Can not get table info');
      }
    );
    };

    self.selectedField = null;
    $scope.showField = function(field) {
      self.selectedField = field;
    };

  }
}());
