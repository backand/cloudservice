(function  () {
    'use strict';
  angular.module('app.apps')
    .controller('Dashboard',["$scope",'$state','AppsService',Dashboard]);

  function Dashboard($scope,$state,AppsService){

    var self = this;

    var currentApp = AppsService.getCurrentApp();

    this.templateId = '1' ; // currentApp.TemplateFile ??

    this.templates = [
      { Id : "1" , imgSrc : "/assets/images/templateDemo.jpeg" },
      { Id : "2" , imgSrc : "/assets/images/templateDemo.jpeg" },
      { Id : "3" , imgSrc : "/assets/images/templateDemo.jpeg" },
      { Id : "4" , imgSrc : "/assets/images/templateDemo.jpeg" }
    ]

    this.updateTemplate = function(templateId){
      AppsService.updateTemplate($state.params.name,templateId)
        .success(function(data){
          $state.go('apps.show',{name: $state.params.name});
        });
    };
  }
}());
