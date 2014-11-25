
(function  () {

  'use strict';
  angular.module('app.apps')
    .controller('AppsShowController',['$scope','appItem','AppsService','$interval','$state',AppsShowController]);

  function AppsShowController($scope,appItem,AppsService,$interval,$state){
    var self = this;
    var appData = appItem.data;
    var connectionStateClass = convertStateNumber(appItem.data.DatabaseStatus);
    var stop;

    function convertStateNumber(stateNumber){
      switch(stateNumber){
        case 0:
              return {class:'bg-warning', text:'not connected yet'};
        case 2:
              return {class:'bg-warning', text:'connections in progress'};
        case 1:
              return {class:"bg-success", text:'connected'};
        default:
          return { class: 'bg-danger', text: 'error'};
      }
    }
    AppsService.setCurrentApp(appItem.data);

    //not connected to database :
    if (appItem.data.DatabaseStatus !== 1) {
      $state.go('database.edit',{name: $state.params.name})
    }



    console.log('app item: ');
    console.log(appItem.data);

    this.connectionState = connectionStateClass;
    var time = new Date();
    this.appLogArray = [
      {time : time , info : "this is the log 1 info" },
      {time : time , info : "this is the log 2 info" },
      {time : time , info : "this is the log 3 info" },
      {time : time , info : "this is the log 4info" },
      {time : time , info : "this is the log 5 info" },
      {time : time , info : "this is the log 6 info" },
      {time : time , info : "this is the log 7 info" },
      {time : time , info : "this is the log 8 info" },
      {time : time , info : "this is the log 9 info" },
      {time : time , info : "this is the log 99 info" },
      {time : time , info : "this is the log 999 info" }
    ];

    this.logLimit = 7;

    this.appTitle = appData.Title;

    this.appName = appData.Name;

    this.connectionStatus = "";


    stop = $interval(function() {
      AppsService.refreshApp($state.params.name);
    }, 30000);

   function stopRefresh() {
    if (angular.isDefined(stop)) {
      $interval.cancel(stop);
      stop = undefined;
    }
  }

  $scope.$on('$destroy', function() {
    // Make sure that the interval is destroyed too
    stopRefresh();
  });


    this.updateAppName = function(){
      AppsService.update(self.appName, self.appTitle)
    }
  }
}());
