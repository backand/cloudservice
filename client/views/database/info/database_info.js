(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('DatabaseInfo',["$scope",'$state','AppsService',DatabaseInfo]);

  function DatabaseInfo($scope,$state,AppsService){
    var self = this;



    function checkDatabaseStatuse(){
      //not connected to DB:
      if (AppsService.currentApp.DatabaseStatus === 2) { //todo : change into : !==
        //var dataSource = DatabaseNamesService.getName(AppsService.currentApp.Database_Source);
        $state.go('apps.data.exs-source.form',{name: $state.params.name, data: $state.params.data})
      } else {
        AppsService.getDBInfo($state.params.name)
          .success(function(data){
            console.log('db info :');
            console.log(data);
            self.data = data;
          })
      }
    }

    checkDatabaseStatuse();


    this.dataSources = AppsService.getDataSources();

    this.currentTab = function (){
      return $state.params.data;
    };

    this.dataName = $state.params.data;

    this.edit = function(){
      $state.go('apps.data.exs-source.form',({name:$state.params.name, data:$state.params.data}));
    }

  }
}());
