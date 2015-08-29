(function () {

  angular.module('common.services')
    .service('HttpBufferService', ['$injector', HttpBufferService]);

  function HttpBufferService($injector) {

    var self = this;
    var buffer = [];

    function retryHttpRequest(config, deferred) {
      function successCallback(response) {
        deferred.resolve(response);
      }
      function errorCallback(response) {
        deferred.reject(response);
      }
      var $http = $injector.get('$http');
      $http = $http || $injector.get('$http');
      $http(config).then(successCallback, errorCallback);
    }

    /**
     * Appends HTTP request configuration object with deferred response attached to buffer.
     */
    self.append = function (config, deferred) {
      buffer.push({
        config: config,
        deferred: deferred
      });
    };

    /**
     * Abandon or reject (if reason provided) all the buffered requests.
     */
    self.rejectAll = function (reason) {
      if (reason) {
        for (var i = 0; i < buffer.length; ++i) {
          buffer[i].deferred.reject(reason);
        }
      }
      buffer = [];
    };

    /**
     * Retries all the buffered requests clears the buffer.
     */
    self.retryAll = function (updater) {
      for (var i = 0; i < buffer.length; ++i) {
        retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
      }
      buffer = [];
    }
  }

}());
