(function () {

  function SingleTableShow($stateParams, ColumnsService, $scope, RulesService, DictionaryService, SecurityService, NotificationService,$rootScope, TablesService, $filter, AppState) {

    var self = this;

    (function init() {
      self.appName = $stateParams.name;
      AppState.set(self.appName);
      self.tableId = $stateParams.tableId;
      self.messages = [];
      self.fields = [];
      self.view = {};
      self.switchTab = switchTab;
      self.fieldTypesRange = ["String", "DateTime", "Integer"];
      self.selectedField = null;
      RulesService.appName = ColumnsService.appName = DictionaryService.appName = SecurityService.appName = self.appName;
      RulesService.tableId = self.tableId;
      $scope.$on('appname:updated', updateAppName);
      $scope.$on('appname:saved', loadTables);

      loadTables();

    }());

    function loadTables()
    {
      TablesService.get(self.appName).then(loadColumns,errorHandler);
    }
    /**
     * Need to het first the tables before loading the page
     * @param tables
     */
    function loadColumns(tables)
    {
      self.tableName = getTableNameById(tables,$stateParams.tableId).name;
      ColumnsService.tableName = DictionaryService.tableName  = self.tableName;
      ColumnsService.get().then(loadColumnsDone,errorHandler); //populate the view configuration data

    }

    function loadColumnsDone(){
      switchTab('fields');
    }

    /**
     * Load the UI for each tab
     * @param tab
     */
    function switchTab (tab) {
      $scope.$broadcast('tabs:' + tab);
    }

    function updateAppName(event, data){
      self.tableName = data;
      ColumnsService.tableName = DictionaryService.tableName  = self.tableName;
    }



    /**
     * Find the table name by id
     * @param id
     * @returns {*|XMLList|XML}
     */
    function getTableNameById(tables,id) {
      return angular.copy($filter('filter')(tables, function (t) {
        return t.__metadata.id === id;
      })[0])
    };

    /**
     * Sync the database into Backand - add all the tables and sync
     */
    self.sync = function () {
      self.syncing = true;
      NotificationService.add('info', 'Sync takes 1-2 minutes');
      ColumnsService.sync()
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
          $rootScope.$broadcast('fetchTables');
          //need to save once after sync to see the changes
          $rootScope.$broadcast('after:sync');

        }, function (err) {
          self.syncing = false;
          NotificationService.add('error', 'Can not sync tables');
        });
    }

    /**
     * delegate any error to notification service
     * @param error
     * @param message
     */
    function errorHandler(error, message) {
      NotificationService.add('error', message);
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
      'TablesService',
      '$filter',
      'AppState',
      SingleTableShow
    ]);

}());
