(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('dataBaseNewSource',["$scope",'$state',dataBaseNewSource]);

  function dataBaseNewSource($scope,$state){
    var self = this;

    this.dataName = $state.params.data;

    this.sumbitForm = function(){
      alert('dsfs');
    }



  }
}());
