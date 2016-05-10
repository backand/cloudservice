(function () {
  'use strict';

  angular.module('common.services')
    .service('SocketService', ['SessionService','$rootScope', 'CONSTS', SocketService]);

  function SocketService(SessionService, $rootScope, CONSTS) {

    var self = this;

    self.socket = {on: function(){}};

    self.login = function(appName){
      var url = CONSTS.socketUrl;
      var token = 'bearer ' + SessionService.getToken();

      try{
        self.socket = io.connect(url, {'forceNew':true });

        self.socket.on('connect', function(){
          console.log('connected');
          self.socket.emit("login", token, '', appName);
        });

        self.socket.on('disconnect', function() {
          console.log('disconnect');
        });

        self.socket.on('reconnecting', function() {
          console.log('reconnecting');
        });
      }
      catch(e){
        console.error("error loading socket: ", e)
      }
    };

    self.on = function (eventName, callback) {
      self.socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(self.socket, args);
        });
      });
    };

    self.emit = function (eventName, data, callback) {
      self.socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(self.socket, args);
          }
        });
      })
    }

  }

})();
