(function() {
  'use strict';

  function httpInterceptor($q, $log,SessionService) {
    return {
        request: function(config) {
          if (SessionService.currentUser) {
            config.headers['Authorization'] =
              SessionService.getAuthHeader();
          }
          return config;
      },
      requestError: function(rejection) {
        $log.debug(rejection);
        return $q.reject(rejection);
      },
      response: function(response) {
        $log.debug('response: ', response);
        return response;
      },
      responseError: function(rejection) {
        $log.debug(rejection);
        return $q.reject(rejection);
      }
    };
  }

  angular.module('common.interceptors.http', [])
    .factory('httpInterceptor', ['$q','$log','SessionService',httpInterceptor]);
})();
