

(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('DatabaseEdit',['$scope','AppsService','$stateParams','$state','DatabaseNamesService','NotificationService',DatabaseEdit]);

  function DatabaseEdit($scope,AppsService,$stateParams,$state,DatabaseNamesService,NotificationService){

    var self = this;
    this.appName = $stateParams.name;

    var currentApp;
    AppsService.getCurrentApp($state.params.name)
      .then(function(data){
        currentApp = data;
        self.dbConnected = currentApp.DatabaseStatus === 1;
        //self.dataName = currentApp.databaseName;
        self.dataName = currentApp.databaseName || 'mysql';
        if (self.dbConnected){
          //connected to data base
          checkDatabaseStatuse();
        }
      },function(err){
        NotificationService('error','cant get current app info');
      });



    this.currentTab = function (){
      return self.dataName;
    };

    function checkDatabaseStatuse(){
        AppsService.getDBInfo($state.params.name)
          .success(function(data){
            self.data = data;
            self.data.databaseName = currentApp.databaseName;
            self.data.server = self.data.ServerName;
            self.data.username = self.data.Username;
            self.data.usingSsh  = self.data.SshUses;
            self.data.usingSsl  = self.data.SslUses;
            self.data.sshRemoteHost  = self.data.SshRemoteHost;
            self.data.sshUser  = self.data.SshUser;
            self.data.sshPort  = self.data.SshPort;
            self.data.sshPassword  = self.data.SshPassword;
            self.data.sshPrivateKey  = self.data.SshPrivateKey;
          })
    }



    this.create = function(){
      //AppsService.createDB($state.params.name,$state.params.data)
      //  .success(function(data){
      //    $state.go('apps.show',{name: $state.params.name});
      //  });
      $state.go('apps.show',{name: $state.params.name});
    };

    this.dataSources = AppsService.getDataSources();


    this.sumbitForm = function(){
      debugger;
      self.data.product = DatabaseNamesService.getNumber(self.dataName);
      console.log('data: ');
      console.log(self.data);
      AppsService.connect2DB($state.params.name, self.data)
        .success(function (data) {
          console.log(data);
          $state.go('apps.show, {name : $state.params.name}');
        })
    };

    this.back = function(){
      $state.go('apps.show',({name:$state.params.name}));
    };


  }
}());
