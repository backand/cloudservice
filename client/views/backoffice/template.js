(function  () {
    'use strict';
  angular.module('backand.backoffice')
    .controller('BackofficeTemplate', ['$state', 'AppsService', 'DatabaseService', 'NotificationService', BackofficeTemplate]);

  function BackofficeTemplate($state, AppsService, DatabaseService, NotificationService) {

    var self = this;

    var currentApp = AppsService.currentApp;
    self.templateId = currentApp.durados_Theme.__metadata.id;

    this.templates = [
      { Id: "2", imgSrc: "assets/images/template_lte.jpg", label: "AdminLTE" },
      { Id: "3", imgSrc: "assets/images/template_devoops.png", label: "Devoops" },
      { Id: "4", imgSrc: "assets/images/template_dashgum.png", label: "Dashgum" }
    ];

    this.updateTemplate = function(templateId){
      self.templateId = templateId;
      DatabaseService.updateTemplate($state.params.appName, templateId)
        .success(function(data) {
          NotificationService.add('success', 'template changed')
        });
    };
  }
}());
