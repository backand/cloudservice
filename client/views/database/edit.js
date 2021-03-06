(function  () {
  'use strict';
angular.module('backand.database')
  .controller('DatabaseEdit', ['$scope', '$http', 'AppsService', '$state', 'DatabaseNamesService',
    'NotificationService', 'DatabaseService', 'DbDataModel', 'usSpinnerService',
    'ConfirmationPopup', '$modal', 'AnalyticsService','ModelService', DatabaseEdit]);

  function DatabaseEdit($scope, $http, AppsService, $state, DatabaseNamesService,
                        NotificationService, DatabaseService, DbDataModel, usSpinnerService,
                        ConfirmationPopup, $modal, AnalyticsService, ModelService) {

    var self = this;
    var currentApp = AppsService.currentApp;

    (function init() {
      if (AppsService.isExampleApp(currentApp))
        $state.go('database.example');
      if (currentApp.DatabaseStatus == 2)
        $state.go('docs.kickstart');
      self.databaseStatus = null;
      self.appName = $state.params.appName;
      self.loading = false;
      self.showHelp = false;
      self.showHelpDialog = false;
      self.usingDefaultModel = false;
      getCurrentApp();
    }());

    function getCurrentApp() {
      self.databaseStatus = currentApp.DatabaseStatus;
      self.dbConnected = currentApp.DatabaseStatus === 1;
      self.dataName = currentApp.databaseName || 'mysql';
      self.data = {
        SslUses: 'true',
        SshUses: 'false'
      };

      if (self.databaseStatus !== 0) {
        checkDatabaseStatus();
        checkForDefaultSchema();
      }
    }

    function checkDatabaseStatus() {
        usSpinnerService.spin("loading");
        DatabaseService.getDBInfo($state.params.appName)
          .success(function (dataIn) {
            self.data = {};
            self.data.Database_Source = dataIn.Database_Source;
            self.data.databaseName = DatabaseNamesService.getDBSource(dataIn.Database_Source);
            self.data.database = dataIn.Catalog;
            self.data.server = dataIn.ServerName;
            self.data.username = dataIn.Username;
            self.data.SshUses  = String(dataIn.SshUses);
            self.data.SslUses  = String(dataIn.SslUses);
            self.data.sshRemoteHost  = dataIn.SshRemoteHost;
            self.data.sshUser   = dataIn.SshUser;
            self.data.sshPort   = dataIn.SshPort;
            self.data.sshPassword   = dataIn.SshPassword;
            self.data.sshPrivateKey   = dataIn.SshPrivateKey;
          });
        usSpinnerService.stop("loading");
    }

    function checkForDefaultSchema(){
      ModelService.usingDefaultSchema(self.appName, false)
          .then(function(result){
            self.usingDefaultModel = result;
          });
    }

    self.create = function () {
      self.loading = true;
      var useSchema = false;
      var product = DatabaseNamesService.getNumber(self.dataName);

      var schema = null;

      if (self.isCustomMode()) {
        try {
          if (!angular.isDefined(self.template.schema)) {
            schema = null;
          }
          else {
            schema = JSON.parse(self.template.schema);
          }
          useSchema = true;
        }
        catch (err) {
          NotificationService.add('error', 'JSON is not properly formatted');
          self.loading = false;
          return;
        }
      } else {
        DbDataModel.removeCustomSchema(self.appName);
      }

        DatabaseService.createDB($state.params.appName, product, self.template.appName, schema)
        .success(function (data) {
          NotificationService.add('info', 'Creating new database... It may take 1-2 minutes');


          if(useSchema)
            AnalyticsService.track('CreatedNewDB', {schema: self.template.schema});
          else
            AnalyticsService.track('CreatedNewDB', {app: self.template.appName});


            AnalyticsService.track('create app', {app: self.template.appName});
          $state.go('docs.kickstart');
        })
        .error(function (err) {
            self.loading = false;
            openValidationModal(err)
        })
    };

    function openValidationModal (error) {

      var modalInstance = $modal.open({
        templateUrl: 'common/modals/confirm_update/confirm_update.html',
        controller: 'ConfirmModelUpdateController as ConfirmModelUpdate',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          validationResponse: function () {
            var validationResponse = {
              valid: 'never',
              warnings: error.split(/\(\d+\)/)
            };
            validationResponse.warnings.shift();
            return validationResponse;
          },
          titles: function () {
            return {
              itemName: 'model',
              detailsTitle: 'The following operations will be performed:',
              resultProperty: 'alter'
            }
          }
        }

      });

      return modalInstance.result;
    }

    self.showHelp = function(){
      self.showHelpDialog = true;
    };

    self.dataSources = DatabaseService.getDataSources();

    self.sumbitForm = function() {
      self.loading = true;
      self.data.product = DatabaseNamesService.getNumber(self.dataName);
      DbDataModel.removeCustomSchema(self.appName);

      if(self.dbConnected) //connected
      {

        //get the current Database_Source
        self.data.Database_Source = DatabaseNamesService.getDBSourceId(self.dataName);
        self.data.databaseName = self.dataName;

        DatabaseService.reConnect2DB($state.params.appName, self.data)
          .success(function (data) {
            //NotificationService.add('info', 'Update App connection to database');

            AnalyticsService.track('ReConnectedExistingDB', {product: self.data.product});

            $state.go('tables.notables', {sync: self.usingDefaultModel});
          })
          .error(function (err) {
            self.loading = false;
          })
      } //not used any more
      //else {
      //    DatabaseService.connect2DB($state.params.appName, self.data)
      //      .success(function (data) {
      //
      //      AnalyticsService.track('ConnectedExistingDB', {product: self.data.product});
      //
      //
      //      NotificationService.add('info', 'Connecting to the database...');
      //          $state.go('docs.get-started')
      //      })
      //      .error(function () {
      //          self.loading = false;
      //          self.showHelp = true;
      //      })
      //}
    };

    self.back = function(){
      $state.go('app.show');
    };

    self.Confirmation = function(msg){
      ConfirmationPopup.confirm(msg, 'Ok', '', true, false);

    };

    // Ace Templates

    self.ace = {
      onLoad: function(_editor) {
        self.ace.editor = _editor;
        _editor.$blockScrolling = Infinity;
        _editor.getSession().setTabSize(2);
      }
    };

    self.customTemplate = {title: "Custom Model", filename: 'create_your_own', appName: '',
      description: 'Design your own database schema model'};
    self.templates = [
      {order:3, title: "Game Shop Store", filename: 'game_shop', appName: 'OnlineGaming-MySql',
        description: 'Schema mode for game shop management store'},
      {order:2, title: "Email Campaigns", filename: 'ecommerce_campaign', appName: 'Email-campaign-MySql',
        description: 'Advanced schema model for building e-commerce campaign app'},
      {order:1, title: "Advertisement Agency", filename: 'ad_system', appName: 'Advertising-System',
        description: 'Complex schema model to support advertising agency app'}
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
      var schema = DbDataModel.getCustomSchema(self.appName);
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

    // save to local storage
    function saveCustomSchema (schema) {
      DbDataModel.saveCustomSchema(self.appName, schema);
    }

    $scope.$watch(function () {
      if (self.customTemplate)
        return self.customTemplate.schema
    }, saveCustomSchema);

    // Field Types

    self.fieldTypes = ['string', 'text', 'datetime', 'float', 'boolean'];

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

    self.chooseDb = function (dbName) {
      if (self.dbConnected && !self.usingDefaultModel)
      {
        self.Confirmation('Changing database is not allowed for connected app.');
        return;
      }
      switch (dbName) {
        case 'mysql':
          self.dataName = 'mysql';
          return;
        case 'postgresql':
          self.dataName = 'postgresql';
          self.data.SshUses = false;
          return;
        case 'sqlserver':
          self.dataName = 'sqlserver';
          self.data.SshUses = false;
          return;
        case 'oracle':
          self.Confirmation('Oracle is available only in the Enterprise edition.');
          return;
        case 'mongodb':
          self.Confirmation('Sorry but mongoDB is in closed Beta');
          return;
      }
    };

    //Control the Create button text to replace the text
    self.loadOpt = function () {
      //window['optimizely'] = window['optimizely'] || [];
      //window['optimizely'].push(["activate", 2928170239]);
    };


  }
}());
