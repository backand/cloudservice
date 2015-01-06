/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SingleTableShow($stateParams, ColumnsService, $scope, RulesService) {

    var self = this;

    self.tableName = $stateParams.tableName;
    self.tableId = $stateParams.tableId;
    self.messages = [];
    self.fields = [];
    self.fieldTypesRange = ["String", "DateTime", "Integer"];
    self.selectedField = null;
    self.appName = $stateParams.name;

    RulesService.appName = self.appName;
    RulesService.tableId = self.tableId;

    ColumnsService.appName = self.appName;
    ColumnsService.tableName = self.tableName;


    self.newAction = function () {
      $scope.$broadcast('newButtonEvent');
    };

    self.switchTab = function (tab) {

      switch (tab) {

        case 'fields':
          $scope.$broadcast('tabs:fields');
          break;

        case 'rules':
          $scope.$broadcast('tabs:rules');
          break;
      }
    };
  }

  angular.module('app')
    .controller('SingleTableShow', [
      '$stateParams',
      'ColumnsService',
      '$scope',
      'RulesService',
      SingleTableShow
    ]);

}());
