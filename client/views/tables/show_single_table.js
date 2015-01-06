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
    self.view = {};
    self.fieldTypesRange = ["String", "DateTime", "Integer"];
    self.selectedField = null;
    self.appName = $stateParams.name;

    RulesService.appName = self.appName;
    RulesService.tableId = self.tableId;

    ColumnsService.appName = self.appName;
    ColumnsService.tableName = self.tableName;


    self.update = function()
    {
      TablesService.update($stateParams.name, self.tableName,self.view).then(upadateSuccessHandler,errorHandler);
    }
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

        case 'settings':
          if(angular.isUndefined(self.view) || angular.isUndefined(self.view.name) || self.view.name == ''   )
            ColumnsService.get($stateParams.name, self.tableId)
              .then(columnSeccessHandler, errorHandler);
          break;
      }
    };


    function columnSeccessHandler(data) {
      self.view = data.data;
      self.fields = data.data.fields;
    }


    function errorHandler(error, message) {
      NotificationService.add('error', message);
      $log.debug(error);
    }
    function upadateSuccessHandler(data) {
      columnSeccessHandler(data);
      NotificationService.add('success', "View configuration was saved");

    }
    upadateSuccessHandler

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
