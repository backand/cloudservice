  (function  () {
  'use strict';
  angular.module('backand')
    .controller('ErdModelController', ['$scope', 'AppsService', 'DbDataModel', 'usSpinnerService', 'DatabaseService', ErdModelController]);

  function ErdModelController($scope, AppsService, DbDataModel, usSpinnerService, DatabaseService) {

    var self = this;

    //TODO: validate & save, maybe see output before saving? Also in json - see model before saving?
    function init() {
      var currentApp = AppsService.currentApp;
      self.appName = currentApp.Name;
      self.fieldTypes = ['string', 'text', 'datetime', 'float', 'boolean'];

      self.showHelpDialog = false;
      self.oldModel = DbDataModel.currentModel;
      self.newModel = DbDataModel.newModel;

      self.chartDataModel = null;

      getSchema();
    }

    function modelToChartData (model) {
      var chartData = {
        nodes: [],
        connections: []
      };
      var pos = 0;

      //TODO: get x,y of nodes in model from localStorage if exists
      // first iteration creates the nodes
      model.forEach(function (obj) {
        var node = {
          name: obj.name,
          id: obj.name,
          x: pos,
          y: pos,
          inputConnectors: [],
          outputConnectors: []
        };

        _.forIn(obj.fields, function (field, fieldname) {
          if (field.object) {
            node.outputConnectors.push({name: fieldname});
          } else if (field.collection) {
            node.inputConnectors.push({name: fieldname});
          }
        });

        chartData.nodes.push(node);

        //TODO: reset pos when goes out of bounds (what are the boundaries?)
        pos += 100;
      });

      // second iteration creates the connectors
      model.forEach(function (obj) {

        var dest = _.find(chartData.nodes, {name: obj.name});
        _.forIn(obj.fields, function (field, fieldname) {
          if (field.collection) {

            var destConnectorIndex = _.findIndex(dest.inputConnectors, {name: fieldname});

            var source = _.find(chartData.nodes, {name: field.collection});
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
        });
      });

      return chartData;
    }

    self.reset = function () {
      DatabaseService.removeCustomSchema(self.appName);
      getSchema();
    };

    function getSchema () {
      usSpinnerService.spin('loading');
      DbDataModel.get(self.appName)
        .then(function (model){
          self.chartDataModel = modelToChartData(model.json);
        })
        .finally(function () {
          usSpinnerService.stop('loading');
        })
    }

    // TODO: watch model and save in local storage. use debounce because x,y can change on drag&drop
    function saveCustomSchema (schema) {
      if (schema) {
        DatabaseService.saveCustomSchema(self.appName, schema);
      }
    }

    $scope.$watch(function () {
      return self.newModel.schema;
    }, saveCustomSchema);

    self.showHelp = function () {
      $scope.$emit('open-help');
    };

    init();
  }

}());
