/**
 * Created by itay on 3/18/15.
 */
(function () {
  'use strict';

  angular.module('app.playground')
    .controller('TodoCtrl', ['$scope', '$http', 'SessionService', 'usSpinnerService', '$state', '$interval', 'AppsService','$rootScope','CONSTS', TodoCtrl]);

  function TodoCtrl($scope, $http, SessionService, usSpinnerService, $state, $interval, AppsService, $rootScope, CONSTS) {

    var self = this;

    var token = SessionService.getToken();
    //self.iFrameSrc = 'http://localhost:9000/#/'; //http://s3.amazonaws.com/todosample.backand.net/index.html

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
