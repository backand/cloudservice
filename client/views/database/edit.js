(function  () {
  'use strict';
angular.module('app.apps')
  .controller('DatabaseEdit', ['$scope', '$http', 'AppsService', '$stateParams', '$state', 'DatabaseNamesService', 'NotificationService', 'DatabaseService', 'usSpinnerService', 'ConfirmationPopup', '$analytics', 'AuthService', DatabaseEdit]);

  function DatabaseEdit($scope, $http, AppsService, $stateParams, $state, DatabaseNamesService, NotificationService, DatabaseService, usSpinnerService, ConfirmationPopup, $analytics, AuthService) {

    var self = this;

    (function init() {
      if ($stateParams.name === 'todo' + AuthService.getUserId())
        $state.go('database.example', {name: $stateParams.name});
      self.databaseStatus = null;
      self.appName = $stateParams.name;
      self.loading = false;
      self.showHelp = false;
      self.showND = true;
      getCurrentApp();
    }());

    function getCurrentApp(){
      AppsService.getCurrentApp($state.params.name)
      .then(function (data) {
        //currentApp = data;
        self.databaseStatus = data.DatabaseStatus;
        self.dbConnected = data.DatabaseStatus === 1;
        self.dataName = data.databaseName || 'newMysql';
        self.data = {
          usingSsl: 'true',
          usingSsh: 'false'
        };

        if (self.databaseStatus !== 0) {
          checkDatabaseStatus();
        }
      }, function (err) {
        NotificationService.add('error', 'can not get current app info');
      });
    }

    self.currentTab = function () {
      return self.dataName;
    };

    function checkDatabaseStatus() {
        usSpinnerService.spin("loading");
        DatabaseService.getDBInfo($state.params.name)
          .success(function (dataIn) {
            self.data = {};
            self.data.Database_Source = dataIn.Database_Source;
            self.data.databaseName = DatabaseNamesService.getDBSource(dataIn.Database_Source);
            self.data.database = dataIn.Catalog;
            self.data.server = dataIn.ServerName;
            self.data.username = dataIn.Username;
            self.data.usingSsh  = String(dataIn.SshUses);
            self.data.usingSsl  = String(dataIn.SslUses);
            self.data.sshRemoteHost  = dataIn.SshRemoteHost;
            self.data.sshUser   = dataIn.SshUser;
            self.data.sshPort   = dataIn.SshPort;
            self.data.sshPassword   = dataIn.SshPassword;
            self.data.sshPrivateKey   = dataIn.SshPrivateKey;
          });
        usSpinnerService.stop("loading");
    }

    self.create = function () {
        self.loading = true;
        var product = DatabaseNamesService.getNumber(self.dataName);
        var schema = null;
        if(angular.isDefined(self.customSchema))
          schema = JSON.parse(self.customSchema);

        DatabaseService.createDB($state.params.name, product, "", schema)
        .success(function (data) {
          NotificationService.add('info','Creating new database... It may take 1-2 minutes');
          $state.go('getting-started-open', {isnew: 'new'});
        })
        .error(function (err) {
            self.loading = false;
        })
    };

    self.dataSources = DatabaseService.getDataSources();

    self.sumbitForm = function() {
      self.loading = true;
      self.data.product = DatabaseNamesService.getNumber(self.dataName);

      if(self.dbConnected) //connected
      {
          DatabaseService.reConnect2DB($state.params.name, self.data)
              .success(function (data) {
                  NotificationService.add('info', 'Update App connection to database');
                  $state.go('apps.index', {name: $state.params.name});
              })
              .error(function (err) {
                  self.loading = false;
              })
      }
      else {
          DatabaseService.connect2DB($state.params.name, self.data)
              .success(function (data) {
              $analytics.eventTrack('connectExisting', {product: self.data.product});

              NotificationService.add('info', 'Connecting to the database...');
                  $state.go('apps.index', {name: $state.params.name})
              })
              .error(function (err) {
                  self.loading = false;
                  self.showHelp = true;
              })
      }
    };

    self.back = function(){
      $state.go('apps.show', {name: $state.params.name});
    };

    self.Confirmation = function(msg){
      ConfirmationPopup.confirm(msg, 'Ok', '', true, false);
    };

    function createCustomDb() {
      try {
        var tables = JSON.parse(self.customSchema);
      }
      catch (err) {
        NotificationService.add('error', 'JSON is not properly formatted');
      }
      if (tables != null) {
        try {
          NotificationService.add('info', 'The process takes 5-7 minutes');
          self.processing = true;
          TablesService.addSchema($state.params.name, self.tableTemplate)
            .then(function (data) {
              $analytics.eventTrack('addedDbTables', {tempate: !0});
              NotificationService.add('success', 'The app is ready with the new tables');
              self.processing = false;
              self.isReady = true;
              //broadcast to NAV
              $rootScope.$broadcast('fetchTables');
              self.isEmptyDb = false;
              checkForExistingTables();
              __insp.push(['tagSession', "addSchema_" + self.activeTemplate]);
            }, function (err) {
              self.processing = false;
              NotificationService.add('error', 'Can not create table ' + table.name);
            })
        }
        catch (err) {
          self.processing = false;
          NotificationService.add('error', err.message);
        }
      }
    }

    function checkForExistingTables() {
      AppsService.appDbStat($state.params.name)
        .then(function(data){
          self.isEmptyDb = data.data.tableCount == 0;
        })
    }


    // Ace Templates

    self.ace = {
      onLoad: function(_editor) {
        self.ace.editor = _editor;
      }
    };

    self.templates = [
      {title: "Create your own", template: 'create_your_own'},
      {title: "Game Shop", template: 'game_shop'},
      {title: "E-commerce Campaign", template: 'ecommerce_campaign'},
      {title: "Advertising System", template: 'advertising_system'}
    ];

    self.getFile = function (file) {
      return $http({
        method: 'GET',
        url: '/views/database/db_templates/' + file.template + '.json'
      }).then (function (result) {
        return angular.toJson(result.data, true);
      })
    };

    self.showFile = function (file) {
      self.getFile(file)
        .then(function (result) {
          self.template = result;
          self.activeFile = file;
        })
    };

    self.showFile(self.templates[0]);

    self.customize = function () {
      self.customMode = true;
      self.customSchema = DatabaseService.getCustomSchema(self.appName) || self.template;
    };

    function saveCustomSchema (schema) {
      DatabaseService.saveCustomSchema(self.appName, schema);
    }

    $scope.$watch('dbedit.customSchema', saveCustomSchema);

    // Field Types

    self.fieldTypes = ['ShortText', 'LongText', 'DateTime', 'Numeric', 'Boolean', 'SingleSelect', 'MultiSelect'];

    self.insertTypeAtChar = function (param) {
      var tokenAtCursor = getTokenAtCursor();
      if (tokenAtCursor !== '""' && tokenAtCursor !== "''")
        param = '"' + param + '"';
      setTimeout(function() { // DO NOT USE $timeout - all changes to ui-ace must be done outside digest loop, see onChange method in ui-ace
        self.ace.editor.insert(param);
      });
    };

    // ace functions

    function getTokenAtCursor () {
      var position = self.ace.editor.getCursorPosition();
      return self.ace.editor.session.getTokenAt(position.row, position.column).value;
    }

  }
}());
