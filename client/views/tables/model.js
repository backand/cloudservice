(function  () {
  'use strict';
  angular.module('backand')
    .controller('ModelController', ['AppsService', ModelController]);

  function ModelController(AppsService) {

    var self = this;
    var currentApp = AppsService.currentApp;

    self.appName = currentApp.Name;

    self.fieldTypes = ['ShortText', 'LongText', 'DateTime', 'Numeric', 'Boolean', 'SingleSelect', 'MultiSelect'];

    function init() {
      getSchema();
    }

    init();

    function getSchema () {
      self.schema = '{a: 1, b: 2}'
    }

    self.ace = {
      onLoad: function(_editor) {
        self.ace.editor = _editor;
        _editor.$blockScrolling = Infinity;
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

    };

  }

}());
