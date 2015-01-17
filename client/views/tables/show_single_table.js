(function () {

  function SingleTableShow($stateParams, ColumnsService, $scope, RulesService, DictionaryService,SecurityService) {

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

      RulesService.appName = ColumnsService.appName = DictionaryService.appName = SecurityService.appName = self.appName;
      RulesService.tableId = self.tableId;
      ColumnsService.tableName = DictionaryService.tableName  = self.tableName;

      ColumnsService.get(); //populate the view configuration data

    }());

    self.update = function () {
      TablesService.update($stateParams.name, self.tableName, self.view).then(upadateSuccessHandler, errorHandler);
    };

    self.switchTab = function (tab) {
      //the tab's events are based on the tab name
      $scope.$broadcast('tabs:' + tab);
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
      'SecurityService',
      SingleTableShow
    ]);

}());
