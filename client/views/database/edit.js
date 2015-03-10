(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('DatabaseEdit', ['$scope', 'AppsService', '$stateParams', '$state', 'DatabaseNamesService', 'NotificationService', 'DatabaseService','usSpinnerService', DatabaseEdit]);

  function DatabaseEdit($scope, AppsService, $stateParams, $state, DatabaseNamesService, NotificationService, DatabaseService,usSpinnerService) {

    var self = this;

    (function init() {
      self.databaseStatus = null;
      self.appName = $stateParams.name;
      self.loading = false;
      self.showHelp = false;
      self.showND = true;
      self.includeData = true;
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
        usSpinnerService.stop("loading");
    }

    self.create = function(){
        self.loading = true;
        var product = DatabaseNamesService.getNumber(self.dataName);

        var sampleApp = "OnlineGaming-MySql";
        if(!self.includeData)
          sampleApp = "";

        DatabaseService.createDB($state.params.name, product, sampleApp)
        .success(function(data){
          NotificationService.add('info','Creating new database... It may takes 1-2 minutes');
          $state.go('getting-started-open');
        })
        .error(function(err){
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
      $state.go('apps.show',({name:$state.params.name}));
    };

  }
}());
