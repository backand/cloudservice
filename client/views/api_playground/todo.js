/**
 * Created by itay on 3/18/15.
 */
(function () {
  'use strict';

  angular.module('app.playground')
    .controller('Todo', ['$scope', '$http', 'SessionService','usSpinnerService','$state', Todo]);

  function Todo($scope, $http, SessionService, usSpinnerService, $state) {

    var self = this;

    var token = SessionService.getToken();

    self.codeFiles = [
      {name: 'index.html', type: 'html'},
      {name: 'project.js', type: 'javascript'},
      {name: 'database.json', type: 'json'},
      {name: 'theme.css', type: 'css'}
    ];


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

    window.addEventListener('message', function (e) {
      var eventName = e.data[0];
      var data = e.data[1];
      switch (eventName) {
        case 'setHeight':
          $("#restIfrmae").height(data + 50);
          break;
        case 'ready':
          var o = document.getElementsByTagName('iframe')[0];
          usSpinnerService.spin("loading");

          var message = {auth: 'bearer ' + token, appName: $state.params.name};
          o.contentWindow.postMessage(message, "*");
          break;
        case 'complete':
          usSpinnerService.stop("loading");
          break;
      }
    }, false);
  }


}());
