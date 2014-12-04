(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('DatabaseEdit', ['$scope', 'AppsService', '$stateParams', '$state', 'DatabaseNamesService', 'NotificationService', 'DatabaseService', DatabaseEdit]);

  function DatabaseEdit($scope, AppsService, $stateParams, $state, DatabaseNamesService, NotificationService, DatabaseService) {

    var self = this;
    var currentApp;

    this.appName = $stateParams.name;
    this.loading = false;

    AppsService.getCurrentApp($state.params.name)
      .then(function(data){
        currentApp = data;
        self.DatabaseStatus = currentApp.DatabaseStatus;
        self.dbConnected = currentApp.DatabaseStatus === 1;
        self.dataName = currentApp.databaseName || 'mysql';
        self.data = {
          usingSsl: 'true',
          usingSsh: 'false'
        };

        if (currentApp.DatabaseStatus !== 0){
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
          .success(function(data) {
            self.data = data;
            self.data.databaseName = DatabaseNamesService.getDBSource(self.data.Database_Source);
            self.data.database = self.data.Catalog;
            self.data.server = self.data.ServerName;
            self.data.username = self.data.Username;
            self.data.usingSsh  = self.data.SshUses;
            self.data.usingSsl  = self.data.SslUses;
            self.data.sshRemoteHost  = self.data.SshRemoteHost;
            self.data.sshUser   = self.data.SshUser;
            self.data.sshPort   = self.data.SshPort;
          })
    }

    this.create = function(){
        self.loading = true;
        var product = DatabaseNamesService.getNumber(self.dataName);

        DatabaseService.createDB($state.params.name,product)
        .success(function(data){
          NotificationService.add('info','Creating new database');
          checkDatabaseStatuse();
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

      DatabaseService.connect2DB($state.params.name, self.data)
        .success(function (data) {
          NotificationService.add('info','App connecting to database');
          $state.go('apps.index', {name : $state.params.name});
        })
        .error(function(err){
          self.loading = false;
        })
    };

    this.back = function(){
      $state.go('apps.show',({name:$state.params.name}));
    };

  }
}());
