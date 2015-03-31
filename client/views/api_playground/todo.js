/**
 * Created by itay on 3/18/15.
 */
(function () {
  'use strict';

  angular.module('app.playground')
    .controller('TodoCtrl', ['$scope', '$http', 'SessionService', 'usSpinnerService', '$state', '$interval', 'AppsService', '$rootScope', 'CONSTS', TodoCtrl]);

  function TodoCtrl($scope, $http, SessionService, usSpinnerService, $state, $interval, AppsService, $rootScope, CONSTS) {

    var self = this;

    var token = SessionService.getToken();
    //self.iFrameSrc = 'http://localhost:9000/#/'; //http://s3.amazonaws.com/todosample.backand.net/index.html

    self.codeFiles = [
      {name: 'index.html', type: 'html'},
      {name: 'main.html', type: 'html'},
      {name: 'main.js', type: 'javascript'},
      {name: 'todo_service.js', type: 'javascript'},
      {name: 'theme.css', type: 'css'},
      {name: 'database.json', type: 'json'}

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
        onLoad : function (_editor) {_editor.$blockScrolling = Infinity;},
        theme:'monokai',
        mode: self.activeFile ? self.activeFile.type : 'html',
        firstLineNumber: 1,
        rendererOptions: { fontSize: 15 }
      };
    };

    window.addEventListener('message', function (e) {
      var eventName = e.data[0];
      var data = e.data[1];
      switch (eventName) {
        case 'setHeight':
          $("#todoIframe").height(data + 50);
          break;
        case 'ready':
          var o = document.getElementsByTagName('iframe')[0];
          usSpinnerService.spin("loading");

          var message = {auth: 'bearer ' + token, appName: $state.params.name, url: CONSTS.appUrl};
          o.contentWindow.postMessage(message, "*");
          break;
        case 'complete':
          usSpinnerService.stop("loading");
          break;
      }
    }, false);

    // Show "wait message" while DB is set up

    function getAppStatus () {
      AppsService.getCurrentApp($state.params.name)
        .then(function (result) {
          if (result) {
            if (result.DatabaseStatus != 1)
            {
              usSpinnerService.spin("loading-iframe");
              self.iframeReady = 0;
            }
            else
            {
              stopRefresh();
              self.iframeReady = 1;
              $rootScope.$broadcast('AppIsReady');
            }
          }
        });
    }

    function stopRefresh() {
      AppsService.all();
      if (angular.isDefined(checkAppStatus)) {
        $interval.cancel(checkAppStatus);
        usSpinnerService.stop("loading-iframe");
        checkAppStatus = undefined;
      }
    }

    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      stopRefresh();
    });

    self.iframeReady = 'unknown';
    getAppStatus();
    var checkAppStatus = $interval(getAppStatus, 3000);

  }


}());
