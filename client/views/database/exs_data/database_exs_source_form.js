(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('dataBaseExsSourceForm',["$scope",'$state','AppsService','DatabaseNamesService',dataBaseExsSourceForm]);

  function dataBaseExsSourceForm($scope,$state,AppsService,DatabaseNamesService){
    var self = this;

    this.dataName = $state.params.data || undefined;

    this.sumbitForm = function(){
      self.data.product = DatabaseNamesService.getNumber($state.params.data);
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
