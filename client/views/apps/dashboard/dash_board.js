(function  () {
    'use strict';
  angular.module('app.apps')
    .controller('Dashboard',["$scope",'$state','AppsService',Dashboard]);

  function Dashboard($scope,$state,AppsService){
    var self = this;

    this.updateTemplate = function(templateId){
      AppsService.updateTemplate($state.params.name,templateId)
        .success(function(data){
          $state.go('apps.show',{name: $state.params.name});
        });
    };
  }
}());
