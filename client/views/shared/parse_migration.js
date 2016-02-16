(function () {
  'use strict';

  angular.module('controllers')
    .controller('ParseMigrationController',
      ['AppsService', 'ParseService', 'AnalyticsService', 'DatabaseService', 'ModelService', 'usSpinnerService', '$modalInstance', '$scope', ParseMigrationController]);

  function ParseMigrationController(AppsService, ParseService, AnalyticsService, DatabaseService, ModelService, usSpinnerService, $modalInstance, $scope) {
    var self = this;
    self.parseSchemeDescription = "Please copy past your Parse schema in the following text area:"
    ;

    self.dataExportDescription = "With the exported data we can load your entire data easily:";

    self.dataSchemePlaceholder = "Parse scheme goes here:\n" +
      "{\"results\":[{\"className\":\"_User\", ...\n" +
      "{\"className\":\"_Product\",\"fields\":{\ ...\n" +
      "\"targetClass\":\"_User\"}}}]}";

    self.schemaPopoverTemplateUrl = "/views/shared/parse_schema_popover.html";

    self.dataExportPopoverTemplateUrl = "/views/shared/parse_data_export_popover.html";

    self.namePattern = /^\w+$/;

    self.create = function () {
      usSpinnerService.spin('loading');
      AppsService.add(self.appName, self.appTitle)
        .then(function (data) {
          createDB(self.appName);
        });
    };

    self.cancel = function(){
      $modalInstance.close();
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

