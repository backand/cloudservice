  (function  () {
  'use strict';
  angular.module('backand')
    .controller('ErdModelController', ['$scope', 'AppsService', 'DbDataModel', 'usSpinnerService', ErdModelController]);

  function ErdModelController($scope, AppsService, DbDataModel, usSpinnerService) {

    var self = this;

    //TODO: validate & save, maybe see output before saving? Also in json - see model before saving?
    function init() {
      var currentApp = AppsService.currentApp;
      self.appName = currentApp.Name;
      self.showHelpDialog = false;
      self.currentModel = DbDataModel.currentModel;
      self.newModel = DbDataModel.newModel;

      getSchema();
    }

    self.saveModel = function () {
      DbDataModel.saveErdModel(self.appName);
    };


    self.reset = function () {
      DbDataModel.removeCustomSchema(self.appName);
      getSchema();
    };

    function getSchema () {
      usSpinnerService.spin('loading');
      DbDataModel.get(self.appName)
        .finally(function () {
          usSpinnerService.stop('loading');
        })
    }

    self.showHelp = function () {
      $scope.$emit('open-help');
    };

    init();
  }

}());
