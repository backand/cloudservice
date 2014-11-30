(function() {
  'use strict';

  function httpInterceptor($rootScope,$q, $log,SessionService,usSpinnerService,NotificationService,$injector) {
    return {
        request: function(config) {
          usSpinnerService.spin("spinner-1");
          usSpinnerService.spin("spinner-1");
          if (SessionService.currentUser) {
            config.headers['Authorization'] =
              SessionService.getAuthHeader();
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
        if ((rejection.config.url+"").indexOf('token') === -1){
          NotificationService.add("error",rejection.data || rejection.data.error_description);
          if(rejection.status === 401){
            SessionService.ClearCredentials();
            return $injector.get('$state').transitionTo('sign_in');
          }
        }
        return $q.reject(rejection);
      }
    };
  }

  angular.module('common.interceptors.http', [])
    .factory('httpInterceptor', ['$rootScope','$q','$log','SessionService','usSpinnerService','NotificationService','$injector',httpInterceptor]);
})();
