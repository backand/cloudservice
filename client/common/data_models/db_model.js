(function() {
  'use strict';

  function DbDataModel(ModelService, DatabaseService) {

    var self = this;

    self.currentModel = {
      schema: null
    };

    self.newModel = {
      schema: null
    };

    self.get = function (appName) {
      return ModelService.get(appName)
        .then (function (response) {
          updateModels(appName, response)
      })
    };

    self.update = function (appName, schema) {
      return ModelService.update(appName, schema)
        .then(function (response) {
          updateModels(appName, response)
        })
    };

    function updateModels (appName, model) {
      self.currentModel.schema = angular.toJson(model.data, true);
      self.newModel.schema =
        DatabaseService.getCustomSchema(appName) || self.currentModel.schema;
      return self.currentModel;
    }

  }

  angular.module('common.data_models')
    .service('DbDataModel', ['ModelService', 'DatabaseService', DbDataModel]);

})();
