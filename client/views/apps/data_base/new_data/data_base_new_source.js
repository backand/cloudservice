(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('dataBaseNewSource',["$scope",'$state','AppsService',dataBaseNewSource]);

  function dataBaseNewSource($scope,$state,AppsService){
    var self = this;

    this.dataName = $state.params.data;

    this.create = function(){
      AppsService.createDB($state.params.name,$state.params.data)
        .success(function(data){
          alert("all good");
        })
      ;
    }



  }
}());
