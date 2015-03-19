/**
 * Created by itay on 3/18/15.
 */
(function () {
  'use strict';

  angular.module('app.playground')
    .controller('Todo', ['$scope', '$http', Todo]);

  function Todo($scope, $http) {

    var self = this;

    self.codeFiles = [
      {name: 'index.html', type: 'html'},
      {name: 'project.js', type: 'javascript'},
      {name: 'database.json', type: 'json'},
      {name: 'theme.css', type: 'css'}
    ];

    $scope.ace = {
      dbType: 'html',
      editors: {},
      onLoad: function(_editor) {
        $scope.ace.editors[_editor.container.id] = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    self.getFile = function (file) {
      $http({
        method: 'GET',
        url: '/examples/todo/' + file.name
      })
        .then(function (result) {
          if (typeof result.data === "object")
            self.todoHTML = angular.toJson(result.data, true);
          else
            self.todoHTML = result.data;
          self.activeFile = file;
        });
    };

    self.getFile(self.codeFiles[0]);

    self.getAceObj = function () {
      return {
        onLoad : ace.onLoad,
        theme:'monokai',
        mode: self.activeFile ? self.activeFile.type : 'html',
        firstLineNumber: 1};
    };



    self.todoHTML1 = "<!doctype html>\n" +
    "<html>\n" +
    "<h1></h1>\n" +
    "</html>";

  }


}());
