(function  () {
  'use strict';
  angular.module('backand.database')
    .controller('DatabaseShow', ['$state', 'AppsService', 'usSpinnerService', 'DatabaseService', 'DatabaseNamesService', DatabaseShow]);

  function DatabaseShow($state, AppsService, usSpinnerService, DatabaseService, DatabaseNamesService) {
    var self = this;

    this.appName = $state.params.appName;
    var currentApp = AppsService.currentApp;
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

    this.getPassword = function() {
      DatabaseService.getAppPassword($state.params.appName)
        .success(function(data) {
          self.data.password = data;
        });
    };

    this.currentTab = function() {
      return currentApp.databaseName;
    };

    this.edit = function() {
      $state.go('database.edit');
    };

    this.back = function() {
      $state.go('app.show');
    };

    this.sync = function(toSync) {
      $state.go('tables.show', ({sync: toSync}));
    };
  }
}());
