/**
 * Created by itay on 3/18/15.
 */
(function () {
  'use strict';

  angular.module('backand.playground')
    .controller('TodoCtrl', ['ExampleAppService', 'SessionService', 'usSpinnerService', '$state', 'AppsService', 'CONSTS', TodoCtrl]);

  function TodoCtrl(ExampleAppService, SessionService, usSpinnerService, $state, AppsService, CONSTS) {

    var self = this;
    self.isNew = function () {
      var isNew = AppsService.currentApp.DatabaseStatus == 2;
      if (isNew)
        usSpinnerService.spin("loading-iframe");
      return isNew;
    };

    // Show "wait message" while DB is set up

    self.iframeReady = function () {
      var dbReady = AppsService.currentApp && AppsService.currentApp.DatabaseStatus == 1;
      if (!dbReady) {
        usSpinnerService.spin("loading-iframe");
      }
      else {
        usSpinnerService.stop("loading-iframe");
      }
      return dbReady;
    };


    self.curApp = function () {
      return AppsService.currentApp;
    };

    var token = SessionService.getToken();
    //self.iFrameSrc = 'http://localhost:9000/#/'; //http://s3.amazonaws.com/todosample.backand.net/index.html

    self.codeFiles = ExampleAppService.codeFiles;

    self.getFile = function (file) {
      ExampleAppService.getFile(file.name)
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
        onLoad: function (_editor) {
          _editor.$blockScrolling = Infinity;
        },
        theme: 'monokai',
        mode: self.activeFile ? self.activeFile.type : 'html',
        firstLineNumber: 1,
        rendererOptions: {fontSize: 15}
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

          var message = {auth: 'bearer ' + token, appName: $state.params.appName, url: CONSTS.appUrl};
          o.contentWindow.postMessage(message, "*");
          break;
        case 'complete':
          usSpinnerService.stop("loading");
          break;
      }
    }, false);

  }


}());
