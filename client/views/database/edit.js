(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('DatabaseEdit', ['$scope', 'AppsService', '$stateParams', '$state', 'DatabaseNamesService', 'NotificationService', 'DatabaseService', DatabaseEdit]);

  function DatabaseEdit($scope, AppsService, $stateParams, $state, DatabaseNamesService, NotificationService, DatabaseService) {

    var self = this;

    this.appName = $stateParams.name;
    this.loading = false;
    this.showHelp = false;

    AppsService.getCurrentApp($state.params.name)
      .then(function(data){
        //currentApp = data;
        self.databaseStatus = data.DatabaseStatus;
        self.dbConnected = data.DatabaseStatus === 1;
        self.dataName = data.databaseName || 'mysql';
        self.data = {
          usingSsl: 'true',
          usingSsh: 'false'
        };

        if (self.databaseStatus !== 0){
          checkDatabaseStatus();
        }
      }, function(err) {
        NotificationService('error','can not get current app info');
      });

    this.currentTab = function () {
      return self.dataName;
    };

    function checkDatabaseStatus() {
        DatabaseService.getDBInfo($state.params.name)
          .success(function(dataIn) {
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
          })
    }

    this.create = function(){
        self.loading = true;
        var product = DatabaseNamesService.getNumber(self.dataName);

        DatabaseService.createDB($state.params.name,product)
        .success(function(data){
          NotificationService.add('info','Creating new database');
          checkDatabaseStatus();
          $state.go('apps.index',{name: $state.params.name});
        })
        .error(function(err){
            self.loading = false;
        })
    };

    this.dataSources = DatabaseService.getDataSources();

    this.sumbitForm = function() {
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
                  NotificationService.add('info', 'App connecting to database');
                  $state.go('apps.index', {name: $state.params.name})
              })
              .error(function (err) {
                  self.loading = false;
                  self.showHelp = true;
              })
      }
    };

    this.back = function(){
      $state.go('apps.show',({name:$state.params.name}));
    };

  }
}());
