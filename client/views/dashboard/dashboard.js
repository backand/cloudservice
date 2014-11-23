(function  () {
    'use strict';
  angular.module('app.apps')
    .controller('Dashboard',["$scope",'$state','AppsService','DatabaseService','NotificationService',Dashboard]);

  function Dashboard($scope,$state,AppsService,DatabaseService,NotificationService){

    var self = this;

    var currentApp = AppsService.getCurrentApp($state.params.name);
    console.log('getCurrentApp :');
    console.log(currentApp);

    this.templateId = currentApp.durados_Theme.__metadata.id;

    this.templates = [
      { Id : "1" , imgSrc : "/assets/images/templateDemo.jpeg" },
      { Id : "2" , imgSrc : "/assets/images/templateDemo.jpeg" },
      { Id : "3" , imgSrc : "/assets/images/templateDemo.jpeg" },
      { Id : "4" , imgSrc : "/assets/images/templateDemo.jpeg" }
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
