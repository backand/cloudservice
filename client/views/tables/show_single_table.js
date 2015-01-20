(function () {

  function SingleTableShow($stateParams, ColumnsService, $scope, RulesService, DictionaryService, SecurityService, NotificationService,$rootScope) {

    var self = this;

    (function init() {
      self.tableName = $stateParams.tableName;
      self.tableId = $stateParams.tableId;
      self.messages = [];
      self.fields = [];
      self.view = {};
      self.switchTab = switchTab;
      self.fieldTypesRange = ["String", "DateTime", "Integer"];
      self.selectedField = null;
      self.appName = $stateParams.name;

      RulesService.appName = ColumnsService.appName = DictionaryService.appName = SecurityService.appName = self.appName;
      RulesService.tableId = self.tableId;
      ColumnsService.tableName = DictionaryService.tableName  = self.tableName;

      ColumnsService.get(); //populate the view configuration data

    }());

    function switchTab (tab) {
      $scope.$broadcast('tabs:' + tab);
    }

    self.sync = function () {
      self.syncing = true;
      NotificationService.add('info', 'Sync takes 1-2 minutes');
      ColumnsService.sync(self.appName)
        .then(function (data) {
          self.syncing = false;
          //update messages
          self.messages = [];
          self.messages.push('New tables added: ' + data.data.added);
          self.messages.push('Tables with error:' + (data.data.newTables - data.data.added));

          if (data.data.errors !== '') {

            //data.data.errors = data.data.errors.replace(/\r?\n/g, "%0D%0A");
            NotificationService.add('error', 'Synchronizing tables completed with errors: ' + data.data.errors);
            self.alertClass = 'tables-alert-with-errors';
            self.messages.push('Errors: ' + data.data.errors);
          }
          else {
            NotificationService.add('success', 'Synchronizing tables was completed successfully');
            self.alertClass = '';
          }
          //refresh tables list
          //broadcast to NAV
          $rootScope.$broadcast('tables.update');


        }, function (err) {
          self.syncing = false;
          NotificationService.add('error', 'Can not sync tables');
        });
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
      'NotificationService',
      '$rootScope',
      SingleTableShow
    ]);

}());
