(function  () {
  'use strict';
  angular.module('backand.database')
    .controller('DatabaseShow', ['$state', 'AppsService', 'usSpinnerService', 'DatabaseService', 'DatabaseNamesService', DatabaseShow]);

  function DatabaseShow($state, AppsService, usSpinnerService, DatabaseService, DatabaseNamesService) {
    var self = this;

    self.appName = $state.params.appName;
    var currentApp = AppsService.currentApp;
    self.isLocal = currentApp.connectionSource === 'local';
    checkDatabaseStatuse();

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
            self.data.usingSsl  = dataIn.SslUses;
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

    self.displayButton = function() {
      return !AppsService.isExampleApp(self.appName);
    };

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
