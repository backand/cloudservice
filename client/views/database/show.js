(function  () {
  'use strict';
  angular.module('app.database')
    .controller('DatabaseShow',["$scope",'$state','AppsService','usSpinnerService','NotificationService','DatabaseService',DatabaseShow]);

  function DatabaseShow($scope,$state,AppsService,usSpinnerService,NotificationService,DatabaseService){
    var self = this;

    var currentApp;
    AppsService.getCurrentApp($state.params.name)
      .then(function(data){
        currentApp = data;
        checkDatabaseStatuse();
        self.dataName = currentApp.databaseName;
      },function(err){
        NotificationService('error','cant get current app info');
      });

    function checkDatabaseStatuse(){
      usSpinnerService.spin("loading");
      //not connected to DB:
        DatabaseService.getDBInfo($state.params.name)
          .success(function(data){
            console.log('db info :');
            console.log(data);
            self.data = data;
            self.data.databaseName = currentApp.databaseName;
            usSpinnerService.stop("loading");
          })

    }



    this.dataSources = DatabaseService.getDataSources();

    this.getPassword = function(){
      DatabaseService.getAppPassword($state.params.name)
        .success(function(data){
          self.data.password = data;
        });
    };

    this.currentTab = function (){
      return currentApp.databaseName;
    };


    this.edit = function(){
      $state.go('database.edit',({name:$state.params.name}));
    };

    this.back = function(){
      $state.go('apps.show',({name:$state.params.name}));
    };

  }
}());
