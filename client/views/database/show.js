(function  () {
  'use strict';
  angular.module('backand.database')
    .controller('DatabaseShow', ['$state', 'AppsService', 'usSpinnerService', 'DatabaseService', 'DatabaseNamesService','ModelService', DatabaseShow]);

  function DatabaseShow($state, AppsService, usSpinnerService, DatabaseService, DatabaseNamesService, ModelService) {
    var self = this;

    self.appName = $state.params.appName;
    var currentApp = AppsService.currentApp;
    self.isLocal = currentApp.connectionSource === 'local';
    self.usingDefaultModel = false;
    self.displayButton = !AppsService.isExampleApp(self.appName); //example app don't show the button
    self.displayButtonTitle = 'Edit Database Connection';
    checkDatabaseStatuse();
    checkForDefaultSchema();

    function checkDatabaseStatuse() {
      usSpinnerService.spin("loading");
      //not connected to DB:
        DatabaseService.getDBInfo($state.params.appName)
          .success(function(dataIn){
            self.data = {};
            self.data.Database_Source = dataIn.Database_Source;
            self.data.databaseName = DatabaseNamesService.getDBSource(dataIn.Database_Source);
            self.data.database = dataIn.Catalog;
            self.data.server = dataIn.ServerName;
            self.data.username = dataIn.Username;
            self.data.usingSsh  = dataIn.SshUses;
            self.data.SslUses  = dataIn.SslUses;
            self.data.sshRemoteHost  = dataIn.SshRemoteHost;
            self.data.sshUser   = dataIn.SshUser;
            self.data.sshPort   = dataIn.SshPort;
            self.data.sshPassword   = dataIn.SshPassword;
            self.data.sshPrivateKey   = dataIn.SshPrivateKey;
            usSpinnerService.stop("loading");
          })
    }

    self.getPassword = function() {
      DatabaseService.getAppPassword(self.appName)
        .success(function(data) {
          self.data.password = data;
        });
    };

    function checkForDefaultSchema(){
      ModelService.usingDefaultSchema(self.appName, false)
        .then(function(result){
          self.usingDefaultModel = result;
          self.displayButton = self.usingDefaultModel || !self.isLocal;
          if(self.displayButton && self.usingDefaultModel)
            self.displayButtonTitle = 'Connect Your Database';
        });
    }


    self.edit = function() {
      $state.go('database.edit');
    };

    self.back = function() {
      $state.go('app.show');
    };

    self.sync = function(toSync) {
      $state.go('tables.show', ({sync: toSync}));
    };
  }
}());
