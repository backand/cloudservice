  (function  () {
  'use strict';
  angular.module('backand')
    .controller('DatabaseModelController', ['$scope', 'AppsService', 'DbDataModel', 'usSpinnerService', '$state', DatabaseModelController]);

  function DatabaseModelController($scope, AppsService, DbDataModel, usSpinnerService, $state) {

    var self = this;

    function init() {
      var currentApp = AppsService.currentApp;
      self.appName = currentApp.Name;
      self.fieldTypes = ['string', 'text', 'datetime', 'float', 'boolean'];
      self.schemaEditor = null;
      self.oldSchemaEditor = null;
      self.editorControl = {};
      self.showHelpDialog = false;
      self.showDiffs = true;
      self.oldModel = DbDataModel.currentModel;
      self.newModel = DbDataModel.newModel;

    }



    init();
  }

}());
