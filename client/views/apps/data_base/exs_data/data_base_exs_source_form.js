(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('dataBaseExsSourceForm',["$scope",'$state','AppsService','DataBaseNamesService',dataBaseExsSourceForm]);

  function dataBaseExsSourceForm($scope,$state,AppsService,DataBaseNamesService){
    var self = this;

    this.dataName = $state.params.data || undefined;

    this.sumbitForm = function(){
      self.data.product = DataBaseNamesService.getNumber($state.params.data);
      console.log('data: ');
      console.log(self.data);
      AppsService.connect2DB($state.params.name,self.data)
        .success(function (data) {
          console.log(data);
          debugger;
          $state.go('apps.show',{name : $state.params.name});
        })
    }


  }
}());
