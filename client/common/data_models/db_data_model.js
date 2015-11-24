(function() {
  'use strict';

  angular.module('common.data_models')
    .service('DbDataModel', ['ModelService', '$localStorage', DbDataModel]);

  function DbDataModel (ModelService, $localStorage) {

    var self = this;

    self.currentModel = {
      schema: null,
      json: null
    };

    self.newModel = {
      schema: null
    };

    function getAppLocalStorage (appName) {
      if (!$localStorage.backand[appName]) {
        $localStorage.backand[appName] = {}
      }
      if (!$localStorage.backand[appName].erdModel) {
        $localStorage.backand[appName].erdModel = {
          nodes: [],
          connections: []
        };
      }
      return $localStorage.backand[appName];
    }

    self.getCustomSchema = function (appName) {
      var customSchema =  getAppLocalStorage(appName).customSchema;
      try {
        if(customSchema != null)
          customSchema = angular.toJson(JSON.parse(customSchema), true);
      } finally {
        return customSchema;
      }
    };

    self.saveCustomSchema = function (appName, schema) {
      if (schema)
        $localStorage.backand[appName].customSchema = schema;
    };

    self.removeCustomSchema = function (appName) {
      $localStorage.backand[appName].customSchema = null;
    };

    self.getErdModel = function (appName) {
      return $localStorage.backand[appName].erdModel;
    };

    self.getErdModelObject = function (appName, objectName) {
      return _.find($localStorage.backand[appName].erdModel.nodes, { name: objectName });
    };

    self.saveErdModel = function (appName) {
      $localStorage.backand[appName].erdModel = self.currentModel.erdModel;
    };

    self.get = function (appName) {
      getAppLocalStorage(appName);
      return ModelService.get(appName)
        .then (function (response) {
          return updateModels(appName, response)
      })
    };

    self.update = function (appName, schema) {
      return ModelService.update(appName, schema)
        .then(function (response) {
          return updateModels(appName, response)
        })
    };

    self.addField = function (objectName, fieldToAdd) {
      var newModelObject = JSON.parse(this.newModel.schema);
      var object = _.find(newModelObject, {name: objectName});
      object.push(fieldToAdd);
      _.extend(object.fields, fieldToAdd);
    };

    function updateModels (appName, model) {
      self.currentModel.schema = angular.toJson(model.data, true);
      self.currentModel.json = model.data;
      self.currentModel.erdModel = modelToChartData(appName, model.data);
      self.saveErdModel(appName);
      self.newModel.schema =
        self.getCustomSchema(appName) || self.currentModel.schema;
      return self.currentModel;
    }

    function modelToChartData (appName, model) {
      var chartData = {
        nodes: [],
        connections: []
      };
      var pos = 0;
      var yIndent = 0;

      // first iteration creates the nodes
      model.forEach(function (obj) {
        var node = {
          name: obj.name,
          id: obj.name,
          inputConnectors: [],
          outputConnectors: []
        };

        var savedModelObject = self.getErdModelObject(appName, obj.name);
        if (savedModelObject) {
          node.x = savedModelObject.x;
          node.y = savedModelObject.y;
        } else {
          node.x = pos += 50;
          node.y = pos + yIndent;
        }

        _.forIn(obj.fields, function (field, fieldname) {
          if (field.object) {
            node.outputConnectors.push({name: fieldname});
          } else if (field.collection) {
            node.inputConnectors.push({name: fieldname});
          }
        });

        chartData.nodes.push(node);

        //TODO: reset pos when goes out of bounds (what are the boundaries?)
        if (pos === 500) {
          pos = 0;
          yIndent += 100;
        }
      });

      // second iteration creates the connectors
      model.forEach(function (obj) {

        var dest = _.find(chartData.nodes, {name: obj.name});
        _.forIn(obj.fields, function (field, fieldname) {
          if (field.collection) {

            var destConnectorIndex = _.findIndex(dest.inputConnectors, {name: fieldname});

            var source = _.find(chartData.nodes, {name: field.collection});
            if(source)
            {
              var sourceConnectorIndex = _.findIndex(source.outputConnectors, {name: field.via});

              chartData.connections.push({
                source: {
                  nodeID: source.name,
                  connectorIndex: sourceConnectorIndex
                },
                dest: {
                  nodeID: dest.name,
                  connectorIndex: destConnectorIndex
                }
              });
            }
          }
        });
      });

      return chartData;
    }

  }

})();
