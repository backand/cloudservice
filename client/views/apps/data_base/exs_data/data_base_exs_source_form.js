(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('dataBaseExsSourceForm',["$scope",'$state','AppsService',dataBaseExsSourceForm]);

  function dataBaseExsSourceForm($scope,$state,AppsService){
    var self = this;
    this.dataName = $state.params.data || undefined;

    this.sumbitForm = function(){
      console.log('data: ');
      console.log(self.data);
      AppsService.connect2DB($state.params.name,self.data);
    }


  }
}());
