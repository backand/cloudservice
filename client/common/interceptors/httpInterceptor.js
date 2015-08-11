(function() {
  'use strict';

  function httpInterceptor($q, SessionService, usSpinnerService, NotificationService, $injector, CONSTS) {
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
          if (rejection.status === 401) {
            SessionService.ClearCredentials();
            NotificationService.add('warning','Logon credentials have expired, please re-login')
            $injector.get('$state').transitionTo('sign_in');
            return $q.reject(rejection);
          }
          if(rejection.data == null) {
            NotificationService.add("error", "An error occurred while communicating with the server, please refresh the page in few seconds");
          } else if (!avoidInterception('responseError', rejection)) {
            NotificationService.add("error", rejection.data);
          }
        }
          return $q.reject(rejection);
      }
    };

    function avoidInterception (type, httpPackage) {
      if (type === 'responseError') {
        // model error in create DB - replaced with modal specifying the errors
        if (httpPackage.config.method === 'POST' &&
          _.startsWith(httpPackage.config.url, CONSTS.appUrl + '/admin/myAppConnection/') &&
          _.startsWith(httpPackage.data, 'Invalid schema:')) return true;

        if(_.startsWith(httpPackage.data, 'Blob is not ready yet')) return true;
      }
    }
  }


  angular.module('common.interceptors.http', [])
    .factory('httpInterceptor', ['$q', 'SessionService', 'usSpinnerService', 'NotificationService', '$injector', 'CONSTS', httpInterceptor]);
})();
