(function () {
  'use strict';

  angular.module('common.data_models')
    .service('DbDataModel', ['ModelService', '$localStorage','$q', DbDataModel]);

  function DbDataModel(ModelService, $localStorage, $q) {

    var self = this;

    function _init() {
      self.currentModel = {
        schema: null,
        json: null,
        appName: null
      };

      self.newModel = {
        schema: null
      };
    }

    _init();

    self.init = function(appName){
      if(appName != self.currentModel.appName){
        _init();
      }
    };


    function getAppLocalStorage(appName) {
      if (!$localStorage.backand) {
        $localStorage.backand = $localStorage.backand || {};
      }
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
      var customSchema = getAppLocalStorage(appName).customSchema;
      try {
        if (customSchema != null)
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
      return _.find($localStorage.backand[appName].erdModel.nodes, {name: objectName});
    };

    self.saveErdModel = function (appName) {
      $localStorage.backand[appName].erdModel = self.newModel.erdModel;
    };

    self.get = function (appName, force) {
      getAppLocalStorage(appName);

      if(self.currentModel.json == null || force || false) {
        return ModelService.get(appName)
          .then(function (response) {
            return updateModels(appName, response)
          })
      } else {
        var deferred = $q.defer();
        var model = {"data": self.currentModel.json};
        deferred.resolve(updateModels(appName, model));
        return deferred.promise;
      }
    };

    self.update = function (appName, schema, afterServerUpdate) {
      return ModelService.update(appName, schema)
        .then(function (response) {
          return updateModels(appName, response, afterServerUpdate)
        })
    };

    // Updates new model schema & erd (localstorage)
    self.updateNewModel = function (appName, model) {
      self.saveCustomSchema(appName, JSON.stringify(model));
      self.newModel.schema = JSON.stringify(model);
      self.newModel.erdModel = self.modelToChartData(appName, model);
      self.saveErdModel(appName);
    };

    function updateModels(appName, model, afterServerUpdate) {
      self.currentModel.appName = appName;
      self.currentModel.schema = angular.toJson(model.data, true);
      self.currentModel.json = model.data;
      self.currentModel.erdModel = self.modelToChartData(appName, model.data);

      if (afterServerUpdate) {
        self.newModel.schema = self.currentModel.schema;
      } else {
        if(self.newModel.schema == null){
          self.newModel.schema = self.getCustomSchema(appName) || self.currentModel.schema;
        }
        else{
          self.newModel.schema = angular.toJson(JSON.parse(self.newModel.schema), true);
        }
      }
      var newModelObject;
      // Handle case when JSON is malformed
      try {
        newModelObject = JSON.parse(self.newModel.schema);
        self.newModel.erdModel = self.modelToChartData(appName, newModelObject);
      }
      catch (e) {
        //newModelObject = JSON.parse(self.currentModel.schema);
      }

      self.saveErdModel(appName);
      return self.currentModel;
    }

    self.modelToChartData = function (appName, model) {
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
          fields: []
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
          var fieldToBeAdded = {name: fieldname, type: '', dbType: ''};
          if (field.rename) {
            fieldToBeAdded.name = field.rename;
          }
          // set db type
          if (field.type) {
            fieldToBeAdded.dbType = field.type;
          }
          else if (field.collection) {
            fieldToBeAdded.dbType = 'collection';
          }
          else {
            fieldToBeAdded.dbType = 'object';
          }
          // set connector type
          if (field.object) {
            fieldToBeAdded.type = 'OutputConnector';
          } else if (field.collection) {
            fieldToBeAdded.type = 'InputConnector';
          } else {
            fieldToBeAdded.type = 'TextField';
          }
          node.fields.push(fieldToBeAdded);
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

            var destConnectorIndex = _.findIndex(dest.fields, {name: fieldname});

            var source = _.find(chartData.nodes, {name: field.collection});
            if (source) {
              var sourceConnectorIndex = _.findIndex(source.fields, {name: field.via});

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
