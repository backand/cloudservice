(function  () {
    'use strict';
  angular.module('app.apps')
    .controller('Dashboard',["$scope",'$state','AppsService','DatabaseService',Dashboard]);

  function Dashboard($scope,$state,AppsService,DatabaseService){

    var self = this;

    debugger;
    var currentApp = AppsService.getCurrentApp();
    console.log('getCurrentApp :');
    console.log(currentApp);

    this.templateId = '1' ; // currentApp.TemplateFile ??

    this.templates = [
      { Id : "1" , imgSrc : "/assets/images/templateDemo.jpeg" },
      { Id : "2" , imgSrc : "/assets/images/templateDemo.jpeg" },
      { Id : "3" , imgSrc : "/assets/images/templateDemo.jpeg" },
      { Id : "4" , imgSrc : "/assets/images/templateDemo.jpeg" }
    ]

    this.updateTemplate = function(templateId){
      DatabaseService.updateTemplate($state.params.name,templateId)
        .success(function(data){
          $state.go('apps.show',{name: $state.params.name});
        });
    };
  }
}());
