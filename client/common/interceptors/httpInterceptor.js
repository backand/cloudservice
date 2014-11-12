(function() {
  'use strict';

  function httpInterceptor($q, $log,SessionService,usSpinnerService,NotificationService) {
    return {
        request: function(config) {
          usSpinnerService.spin("spinner-1");
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
        //if not sign in screen :
        if ((rejection.config.url+"").indexOf('token') === -1){
          NotificationService.add(rejection);
        }
        return $q.reject(rejection);
      }
    };
  }

  angular.module('common.interceptors.http', [])
    .factory('httpInterceptor', ['$q','$log','SessionService','usSpinnerService','NotificationService',httpInterceptor]);
})();
