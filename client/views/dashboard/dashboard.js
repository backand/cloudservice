(function  () {
    'use strict';
  angular.module('app.apps')
    .controller('Dashboard',["$scope",'$state','AppsService','DatabaseService','NotificationService',Dashboard]);

  function Dashboard($scope,$state,AppsService,DatabaseService,NotificationService){

    var self = this;

    var currentApp;
    AppsService.getCurrentApp($state.params.name)
      .then(function(data){
        currentApp = data;
        self.templateId = currentApp.durados_Theme.__metadata.id;
      },function(err){
        NotificationService('error','cant get current app info');
      });


    this.templates = [
      { Id : "2" , imgSrc : "assets/images/template_lte.jpg", label: "AdminLTE" },
      { Id : "3" , imgSrc : "assets/images/template_devoops.png", label: "Devoops" },
      { Id : "4" , imgSrc : "assets/images/template_dashgum.png", label: "Dashgum" }
    ]

    this.updateTemplate = function(templateId){
      self.templateId = templateId;
      DatabaseService.updateTemplate($state.params.name,templateId)
        .success(function(data){
          NotificationService.add('success','template changed')
        });
    };
  }
}());
