  (function  () {
  'use strict';
  angular.module('backand')
    .controller('ModelController', ['$rootScope', '$scope', 'AppsService', 'ModelService', 'usSpinnerService', 'NotificationService', 'DatabaseService', ModelController]);

  function ModelController($rootScope, $scope, AppsService, ModelService, usSpinnerService, NotificationService, DatabaseService) {

    var self = this;
    var currentApp = AppsService.currentApp;

    self.appName = currentApp.Name;

    self.fieldTypes = ['string', 'text', 'datetime', 'float', 'boolean', 'binary'];
    self.schemaEditor = null;

    self.aceDiffOptions = {
      onLoad : function(editor) {
        editor.$blockScrolling = Infinity;
        editor.getSession().setTabSize(2);
      },
      theme:'ace/theme/monokai',
      mode: 'ace/mode/json',
      right: {
        editable: false
      },
      left: {}
    };

    function init() {
      getSchema();
    }

    init();

    function getSchema () {
      usSpinnerService.spin('loading');
      ModelService.get(self.appName)
        .then(function (data) {
          updateSchema(data);
          usSpinnerService.stop('loading');
        },
        errorHandler)
    }

    // save schema in local storage
    function saveCustomSchema (schema) {
      DatabaseService.saveCustomSchema(self.appName, schema);
    }

    $scope.$watch(function () {
      if (self.schemaEditor)
        return self.schemaEditor.getValue()
    }, saveCustomSchema);

    function updateSchema (data) {
      self.schema = angular.toJson(data.data, true);
      self.aceDiffOptions.right.content = self.schema;
      // get schema from local storage if exists
      self.aceDiffOptions.left.content = DatabaseService.getCustomSchema(self.appName) || self.schema;
      $rootScope.$broadcast('ace-update');
    }

    self.insertTypeAtChar = function (param) {
      var tokenAtCursor = getTokenAtCursor();
      if (tokenAtCursor !== '""' && tokenAtCursor !== "''")
        param = '"' + param + '"';

      setTimeout(function() { // DO NOT USE $timeout - all changes to ui-ace must be done outside digest loop, see onChange method in ui-ace
        self.schemaEditor.insert(param);
      });
    };

    function getTokenAtCursor () {
      var position = self.schemaEditor.getCursorPosition();
      var token = self.schemaEditor.session.getTokenAt(position.row, position.column);
      if (token !== null) return token.value;
    }

    self.update = function() {
      self.loading = true;
      var schema = JSON.parse(self.schemaEditor.getValue());
      ModelService.update(self.appName, schema)
        .then(function(data){
          updateSchema(data);
          $rootScope.$broadcast('fetchTables');
          self.loading = false;
        },
        modelErrorHandler)
    };

    function modelErrorHandler(error, message){
      getSchema();
      $rootScope.$broadcast('fetchTables');
      self.loading = false;
      usSpinnerService.stop('loading');
    }

    function errorHandler(error, message) {
      NotificationService.add('error', message);
      self.loading = false;
      usSpinnerService.stop('loading');
    }
  }

}());
