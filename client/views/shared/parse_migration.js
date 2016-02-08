(function () {
  'use strict';

  angular.module('controllers')
    .controller('ParseMigrationController',
    ['AppsService', 'ParseService', 'AnalyticsService', 'DatabaseService', 'ModelService', ParseMigrationController]);

  function ParseMigrationController(AppsService, ParseService, AnalyticsService, DatabaseService, ModelService) {
    var self = this;
    self.parseSchemeDescription = "With this we can create your database. To get your app scheme do that and this.";

    self.dataExportDescription = "Instructions for Data Export";

    self.create = function () {
      AppsService.add(self.appName, self.appDescription)
        .then(function (data) {
          createDB(self.appName);
        });
    };

    function createDB(appName) {

      AnalyticsService.track('CreatedApp', {appName: appName});

      //create app with default schema
      var product = 10; //New MySQL

      DatabaseService.createDB(appName, product, '', ModelService.defaultSchema())
        .success(function (data) {
          AnalyticsService.track('CreatedNewDB', {schema: ModelService.defaultSchema()});
          AnalyticsService.track('create app', {app: appName});
          ParseService.post(self.parseUrl, self.parseSchema).then(function (data) {
            console.log('success');
          })
        });
    }
  }


}());

