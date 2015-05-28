(function() {
  'use strict';

  function httpInterceptor($q, SessionService, usSpinnerService, NotificationService, $injector) {
    return {
        request: function(config) {
          usSpinnerService.spin("spinner-1");
          if (SessionService.currentUser) {
            config.headers['Authorization'] = SessionService.getAuthHeader();
          }
          return config;
      },
      requestError: function(rejection) {
        return $q.reject(rejection);
      },
      response: function(response) {
        return response;
      },
      responseError: function(rejection) {
        //if not sign in screen :
        usSpinnerService.stop("loading");
        if ((rejection.config.url + "").indexOf('token') === -1){
          if(rejection.data == null)
            NotificationService.add("error", "The service is temporary unavailable, please refresh the page in few seconds");
          else
            NotificationService.add("error", rejection.data);
          if (rejection.status === 401) {
            SessionService.ClearCredentials();
            $injector.get('$state').transitionTo('sign_in');
            return $q.reject(rejection);
          }
        }
          return $q.reject(rejection);
      }
    };
  }

  angular.module('common.interceptors.http', [])
    .factory('httpInterceptor', ['$q', 'SessionService', 'usSpinnerService', 'NotificationService', '$injector', httpInterceptor]);
})();
