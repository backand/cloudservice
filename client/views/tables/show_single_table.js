(function () {

  function SingleTableShow($stateParams, ColumnsService, $scope, RulesService, DictionaryService) {

    var self = this;

    (function init() {
      self.tableName = $stateParams.tableName;
      self.tableId = $stateParams.tableId;
      self.messages = [];
      self.fields = [];
      self.view = {};
      self.fieldTypesRange = ["String", "DateTime", "Integer"];
      self.selectedField = null;
      self.appName = $stateParams.name;

      RulesService.appName = ColumnsService.appName = DictionaryService.appName  = self.appName;
      RulesService.tableId = self.tableId;
      ColumnsService.tableName = DictionaryService.tableName  = self.tableName;

    }());

    self.update = function () {
      TablesService.update($stateParams.name, self.tableName, self.view).then(upadateSuccessHandler, errorHandler);
    };

    self.switchTab = function (tab) {

      switch (tab) {
        case 'fields':
          $scope.$broadcast('tabs:fields');
          break;

        case 'rules':
          $scope.$broadcast('tabs:rules');
          break;

        case 'settings':
          $scope.$broadcast('tabs:settings');
          break;
      }
    };

    function upadateSuccessHandler(data) {
      NotificationService.add('success', "View configuration was saved");
    }
  }

  angular.module('app')
    .controller('SingleTableShow', [
      '$stateParams',
      'ColumnsService',
      '$scope',
      'RulesService',
      'DictionaryService',
      SingleTableShow
    ]);

}());
