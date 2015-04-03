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
      var useSchema = false;
      var product = DatabaseNamesService.getNumber(self.dataName);

      var schema = null;

      if (self.isCustomMode()) {
        try {
          if(!angular.isDefined(self.template.schema))
            schema = null;
          else
            schema = JSON.parse(self.template.schema);
          useSchema = true;
        }
        catch (err) {
          NotificationService.add('error', 'JSON is not properly formatted');
          self.loading = false;
          return;
        }
      }

        DatabaseService.createDB($state.params.name, product, self.template.appName, schema)
        .success(function (data) {
          NotificationService.add('info', 'Creating new database... It may take 1-2 minutes');
          if(useSchema)
            $analytics.eventTrack('create app', {schema: self.template.schema});
          else
            $analytics.eventTrack('create app', {app: self.template.appName});
          $state.go('playground.get-started', {name: $state.params.name, isnew: 'new'});
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

    // Ace Templates

    self.ace = {
      onLoad: function(_editor) {
        self.ace.editor = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    self.customTemplate = {title: "Custom Model", filename: 'create_your_own', appName: '', description: 'Design your own database schema model'};
    self.templates = [
      {order:3, title: "Game Shop Store", filename: 'game_shop', appName: 'OnlineGaming-MySql', description: 'Schema mode for game shop management store'},
      {order:2, title: "Email Campaigns", filename: 'ecommerce_campaign', appName: 'Email-campaign-MySql', description: 'Advanced schema model for building e-commerce campaign app'},
      {order:1, title: "Advertisement Agency", filename: 'advertising_system', appName: 'Advertising-System', description: 'Complex schema model to support advertising agency app'}
    ];

    self.getFile = function (template) {
      return $http({
        method: 'GET',
        url: 'views/database/db_templates/' + template.filename + '.json'
      }).then (function (result) {
        return angular.toJson(result.data, true);
      })
    };

    self.showFile = function (template) {
      if(self.ace && self.ace.editor)
        self.ace.editor.setReadOnly(true);
      self.template = template;
      if (!template.schema) {
        self.getFile(template)
          .then(function (result) {
            template.schema = result;
          });
      }
    };

    self.isCustomMode = function () {
      return self.template === self.customTemplate;
    };

    self.customize = function () {
      self.template = self.customTemplate;
      var schema = DatabaseService.getCustomSchema(self.appName);
      if (schema) {
        self.template.schema = schema;
      }
      else {
        self.showFile(self.customTemplate);
      }
      if(self.ace && self.ace.editor)
        self.ace.editor.setReadOnly(false);
    };

    self.customize();

    function saveCustomSchema (schema) {
       DatabaseService.saveCustomSchema(self.appName, schema);
    }

    $scope.$watch('dbedit.customTemplate.schema', saveCustomSchema);

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
