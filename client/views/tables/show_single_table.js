/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SingleTableShow($stateParams, $log, NotificationService, ColumnsService, RulesService, $scope) {

    var self = this;

    self.tableName = $stateParams.tableName;
    self.tableId = $stateParams.tableId;
    self.messages = [];
    self.fields = [];
    self.view = {};
    self.fieldTypesRange = ["String", "DateTime", "Integer"];
    self.selectedField = null;

    self.newAction = function () {
      $scope.$broadcast('newButtonEvent');
    };

    self.switchTab = function (tab) {

      switch (tab) {

        case 'fields':
          ColumnsService.get($stateParams.name, self.tableName)
            .then(columnSeccessHandler, errorHandler);
          break;

        case 'rules':
        RulesService.get($stateParams.name, self.tableId)
          .then(rulesSuccsessHandler, errorHandler);
        break;

        case 'settings':
          if(angular.isUndefined(self.view) || angular.isUndefined(self.view.name) || self.view.name == ''   )
            ColumnsService.get($stateParams.name, self.tableId)
              .then(columnSeccessHandler, errorHandler);
          break;
      }

    };

    function rulesSuccsessHandler(data) {
      self.items = data.data.data;
    }

    function columnSeccessHandler(data) {
      self.view = data.data;
      self.fields = data.data.fields;
    }


    function errorHandler(error, message) {
      NotificationService.add('error', message);
      $log.debug(error);
    }

  }

  angular.module('app')
    .controller('SingleTableShow', [
      '$stateParams',
      '$log',
      'NotificationService',
      'ColumnsService',
      'RulesService',
      SingleTableShow
    ]);

}());
