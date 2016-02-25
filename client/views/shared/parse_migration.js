(function () {
  'use strict';

  angular.module('controllers')
    .controller('ParseMigrationController',
    ['AppsService', 'ParseService', 'AnalyticsService', 'DatabaseService', 'ModelService', 'usSpinnerService', '$modalInstance', '$scope', 'NotificationService', ParseMigrationController]);

  function ParseMigrationController(AppsService, ParseService, AnalyticsService, DatabaseService, ModelService, usSpinnerService, $modalInstance, $scope, NotificationService) {
    var self = this;
    self.parseSchemeDescription = "Paste your Parse schema here:"
    ;

    self.dataExportDescription = "Paste your Parse data zip file link here:";

    self.dataSchemePlaceholder = "Parse scheme goes here:\n" +
    "{\"results\":[{\"className\":\"_User\", ...\n" +
    "{\"className\":\"_Product\",\"fields\":{\ ...\n" +
    "\"targetClass\":\"_User\"}}}]}";

    self.schemaPopoverTemplateUrl = "views/shared/parse_schema_popover.html";

    self.dataExportPopoverTemplateUrl = "views/shared/parse_data_export_popover.html";

    self.namePattern = /^\w+$/;

    self.create = function () {
      usSpinnerService.spin('loading-migration');
      if (validate(self.parseUrl, self.parseSchema)) {
        AppsService.add(self.appName, self.appTitle)
          .then(function (data) {
            createDB(self.appName);

          });
      } else {
        usSpinnerService.stop('loading-migration');
      }
    };

    self.cancel = function () {
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

    function validate(data, schema) {
      if (validateData(data)) {
        return validateSchema(schema);
      }
      return false;
    }

    function validateSchema(schema) {
      try {
        var schemaObject = JSON.parse(schema);
      } catch (e) {
        NotificationService.add('error', 'Parse schema should be a valid JSON');
        return false;
      }
      if (!schemaObject.results) {
        NotificationService.add('error', 'Schema should include "results" property');
        return false;
      }

      var isContainValidObject = _.some(schemaObject.results, function (object) {
        return object.className && object.fields;
      });

      if (!isContainValidObject) {
        NotificationService.add('error', 'Schema should contain a valid object with "className" and "fields" properties');
        return false;
      }

      return true;
    }

    function validateData(data) {
      if (!data.startsWith("http")) {
        NotificationService.add('error', 'Parse data should be a valid URL');
        return false;
      }
      return true;
    }
  }

}());

