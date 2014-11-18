(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('DataBaseInfo',["$scope",'$state','AppsService',DataBaseInfo]);

  function DataBaseInfo($scope,$state,AppsService){
    var self = this;

    function checkDataBaseStatuse(){
      if (AppsService.currentApp.DatabaseStatus === 2) {
        //var dataSource = DataBaseNamesService.getName(AppsService.currentApp.Database_Source);
        $state.go('apps.data.exs-source.form',{name: $state.params.name, data: $state.params.data})
      } else {
        //
      }
    }

    checkDataBaseStatuse();

    this.dataSources = AppsService.getDataSources();

    this.currentTab = function (){
      return $state.params.data;
    };

    this.dataName = $state.params.data;

    this.edit = function(){
      $state.go('apps.data.exs-source.form',({data:$state.params.data}));
    }

  }
}());
