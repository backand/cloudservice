/**
 * Created by itay on 3/18/15.
 */
(function () {
  'use strict';

  angular.module('app.playground')
    .controller('Todo', ['$scope', Todo]);

  function Todo($scope) {

    var self = this;

    $scope.ace = {
      dbType: 'html',
      editors: {},
      onLoad: function(_editor) {
        $scope.ace.editors[_editor.container.id] = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    self.todoHTML = "<!doctype html>\n" +
    "<html>\n" +
    "<h1></h1>\n" +
    "</html>";

  }


}());
