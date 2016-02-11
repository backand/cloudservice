(function () {
  'use strict';

  angular.module('controllers')
    .controller('ParseMigrationController',
    ['AppsService', 'ParseService', 'AnalyticsService', 'DatabaseService', 'ModelService', 'usSpinnerService', '$modalInstance', '$scope', ParseMigrationController]);

  function ParseMigrationController(AppsService, ParseService, AnalyticsService, DatabaseService, ModelService, usSpinnerService, $modalInstance, $scope) {
    var self = this;
    self.parseSchemeDescription = "With this we can create your database. To get your app scheme do that and this.";

    self.dataExportDescription = "Instructions for Data Export";

    self.create = function () {
      usSpinnerService.spin('loading');
      AppsService.add(self.appName, self.appTitle)
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
          startMigration();
          AnalyticsService.track('CreatedNewDB', {schema: ModelService.defaultSchema()});
          AnalyticsService.track('create app', {app: appName});
        });
    }

    function startMigration() {
      ParseService.post(self.parseUrl, self.parseSchema, self.appName).then(function (data) {
        usSpinnerService.stop('loading');
        $modalInstance.close({success: true});
      });
    }
  }


}());
