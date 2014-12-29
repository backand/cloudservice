(function  () {
  'use strict';
  angular.module('app')
    .controller('SingleTableShow', ['$scope', '$state', 'AppsService', 'usSpinnerService', 'NotificationService', 'ColumnsService','$timeout', '$log', SingleTableShow]);

  function SingleTableShow($scope, $state, AppsService, usSpinnerService, NotificationService, ColumnsService, $timeout, $log) {
    


    $log.debug($state.params);
    var self = this;
    var currentApp;
    self.messages = ["no stats yet..."];
    self.alertClass = "";
    $scope.fields = [];
    $scope.fieldTypesRange = ["String", "DateTime", "Integer"];
    

    $scope.switchTab = function(tab) {
      $log.debug("switchTab", tab);
      ColumnsService.get($state.params.appName, $state.params.tableName)
      .then(function(data) {
        $log.debug("columns success:", data);
        
        $scope.fields = data.data.fields;
      }, 
      function(err) {
        $log.debug("columns failure:", err);
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
