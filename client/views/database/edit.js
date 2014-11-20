

(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('DatabaseEdit',['$scope','AppsService','$stateParams','$state','DatabaseNamesService',DatabaseEdit]);

  function DatabaseEdit($scope,AppsService,$stateParams,$state,DatabaseNamesService){

    var self = this;
    this.appName = $stateParams.name;

    var currentApp = AppsService.getCurrentApp();

    this.currentTab = function (){
      return self.dataName;
    };

    function checkDatabaseStatuse(){
      //not connected to DB:
      if (currentApp.DatabaseStatus === 2) { //todo : change into : !==
        //var dataSource = DatabaseNamesService.getName(currentApp.Database_Source);
        $state.go('database.edit',{name: $state.params.name})
      } else {
        AppsService.getDBInfo($state.params.name)
          .success(function(data){
            console.log('db info :');
            console.log(data);
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
    }

    //if (currentApp.DatabaseStatus === 1){
      checkDatabaseStatuse();
    //}


    this.dataName = currentApp.databaseName;

    this.create = function(){
      //AppsService.createDB($state.params.name,$state.params.data)
      //  .success(function(data){
      //    $state.go('apps.show',{name: $state.params.name});
      //  });
      $state.go('apps.show',{name: $state.params.name});
    };

    this.dataSources = AppsService.getDataSources();

    this.dataName = currentApp.databaseName || undefined;

    this.sumbitForm = function(){
      self.data.product = DatabaseNamesService.getNumber(currentApp.databaseName);
      console.log('data: ');
      console.log(self.data);
      AppsService.connect2DB($state.params.name, self.data)
        .success(function (data) {
          console.log(data);
          debugger;
          $state.go('apps.show, {name : $state.params.name}');
        })
    };


  }
}());
