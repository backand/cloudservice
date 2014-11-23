(function  () {
  'use strict';
  angular.module('app.database')
    .controller('DatabaseShow',["$scope",'$state','AppsService','usSpinnerService',DatabaseShow]);

  function DatabaseShow($scope,$state,AppsService,usSpinnerService){
    var self = this;

    var currentApp = AppsService.getCurrentApp($state.params.name);

    function checkDatabaseStatuse(){
      usSpinnerService.spin("loading"); //todo:not working ?
      //not connected to DB:
      if (currentApp.DatabaseStatus !== 1) {
        $state.go('database.edit',{name: $state.params.name})
      } else {

        AppsService.getDBInfo($state.params.name)
          .success(function(data){
            console.log('db info :');
            console.log(data);
            self.data = data;
            self.data.databaseName = currentApp.databaseName;
            //usSpinnerService.stop("spinner-loading");
          })
      }
    }

    checkDatabaseStatuse();


    this.dataSources = AppsService.getDataSources();

    this.getPassword = function(){
      AppsService.getAppPassword($state.params.name)
        .success(function(data){
          self.data.password = data;
        });
    };

    this.currentTab = function (){
      return currentApp.databaseName;
    };

    this.dataName = currentApp.databaseName;

    this.edit = function(){
      $state.go('database.edit',({name:$state.params.name}));
    };

    this.back = function(){
      $state.go('apps.show',({name:$state.params.name}));
    };

  }
}());
