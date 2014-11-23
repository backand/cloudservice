
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

    console.log('app item: ');
    console.log(appItem.data);

    this.connectionState = connectionStateClass;


    this.appName = appData.Name;

    this.connectionStatus = "";


    stop = $interval(function() {
      AppsService.refresh($state.params.name);
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
      AppsService.update(self.appName)
    }
  }
}());
