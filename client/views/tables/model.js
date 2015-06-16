  (function  () {
  'use strict';
  angular.module('backand')
    .controller('ModelController', ['$scope', 'AppsService', 'ModelService', 'usSpinnerService', 'NotificationService', ModelController]);

  function ModelController($scope, AppsService, ModelService, usSpinnerService, NotificationService) {

    var self = this;
    var currentApp = AppsService.currentApp;

    self.appName = currentApp.Name;

    self.fieldTypes = ['string', 'text', 'datetime', 'float', 'boolean', 'binary'];

    function init() {
      getSchema();
    }

    init();

    function getSchema () {
      usSpinnerService.spin('loading');
      ModelService.get(self.appName)
        .then(function (data) {
          self.schema = angular.toJson(data.data, true);
          usSpinnerService.stop('loading');
        },
        errorHandler)
    }

    self.ace = {
      onLoad: function(_editor) {
        self.ace.editor = _editor;
        _editor.$blockScrolling = Infinity;
        _editor.getSession().setTabSize(2);
      }
    };

    self.insertTypeAtChar = function (param) {
      var tokenAtCursor = getTokenAtCursor();
      if (tokenAtCursor !== '""' && tokenAtCursor !== "''")
        param = '"' + param + '"';

      setTimeout(function() { // DO NOT USE $timeout - all changes to ui-ace must be done outside digest loop, see onChange method in ui-ace
        self.ace.editor.insert(param);
      });
    };

    function getTokenAtCursor () {
      var position = self.ace.editor.getCursorPosition();
      var token = self.ace.editor.session.getTokenAt(position.row, position.column);
      if (token !== null) return token.value;
    }

    self.update = function() {
      self.loading = true;
      var schema = JSON.parse(self.schema);
      ModelService.update(self.appName, schema)
        .then(function(data){
          self.schema = angular.toJson(data.data, true);
          $scope.$root.$broadcast('fetchTables');
          self.loading = false;
        },
        modelErrorHandler)
    };

    function modelErrorHandler(error, message){
      getSchema();
      $scope.$root.$broadcast('fetchTables');
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
