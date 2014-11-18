(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('dataBaseExsSource',["$scope",'$state','AppsService',dataBaseExsSource]);

  function dataBaseExsSource($scope,$state,AppsService){
    var self = this;

    this.dataSources = AppsService.getDataSources();


  }
}());
