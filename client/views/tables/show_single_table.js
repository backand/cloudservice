(function () {


  angular.module('backand')
    .controller('SingleTableShow', [
      '$stateParams',
      'ColumnsService',
      '$scope',
      'RulesService',
      'DictionaryService',
      'SecurityService',
      'NotificationService',
      '$rootScope',
      'tableName',
      SingleTableShow
    ]);

  function SingleTableShow($stateParams, ColumnsService, $scope, RulesService, DictionaryService, SecurityService,
                           NotificationService, $rootScope, tableName) {

    var self = this;

    (function init() {
      self.appName = $stateParams.appName;
      self.tableId = $stateParams.tableId;
      self.tableName = tableName;
      self.messages = [];
      self.fields = [];
      self.view = {};
      self.fieldTypesRange = ["String", "DateTime", "Integer"];
      self.selectedField = null;
      self.tabs = [
        {
          heading: 'Fields',
          route: '^.fields'
        },
        {
          heading: 'Actions',
          route: '^.actions'
        },
        {
          heading: 'Security',
          route: '^.security'
        },
        {
          heading: 'Settings',
          route: '^.settings'
        },
        {
          heading: 'Data',
          route: '^.data'
        },
        {
          heading: 'REST API',
          route: '^.restapi'
        }/*
        {
          heading: 'Config Log',
          route: 'tables.columns.log'
        }*/
      ];
      RulesService.appName = ColumnsService.appName = DictionaryService.appName = SecurityService.appName = self.appName;
      RulesService.tableId = self.tableId;
      $scope.$on('appname:updated', updateAppName);
      $scope.$on('appname:saved', loadColumns);

      loadColumns();

    }());

    /**
     * Need to het first the tables before loading the page
     * @param tables
     */
    function loadColumns()
    {
      ColumnsService.get().then(null, errorHandler); //populate the view configuration data
    }

    function updateAppName(event, data){
      self.tableName = data;
      ColumnsService.tableName = DictionaryService.tableName  = self.tableName;
    }

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

          __insp.push(['tagSession', "sync tables_" + data.data.added]);
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
    };

    /**
     * delegate any error to notification service
     * @param error
     * @param message
     */
    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }
  }

}());
