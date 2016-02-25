(function() {
  'use strict';

  angular.module('common.interceptors.http', [])
    .factory('httpInterceptor', ['$q', 'SessionService', 'usSpinnerService', 'NotificationService', 'HttpBufferService', '$injector', 'CONSTS', httpInterceptor]);

  function httpInterceptor($q, SessionService, usSpinnerService, NotificationService, HttpBufferService, $injector, CONSTS) {
    return {
      request: function(config) {
        usSpinnerService.spin("spinner-1");
        if (SessionService.currentUser && SessionService.currentUser.access_token) {
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

        var state = $injector.get('$state');

        if (rejection.config.url !== CONSTS.appUrl + '/token') {

          if (rejection.status === 401) {

            if (rejection.data && rejection.data.Message === 'invalid or expired token') {
              if (SessionService.currentUser && SessionService.currentUser.refresh_token) {

                SessionService.clearToken();

                var deferred = $q.defer();
                HttpBufferService.append(rejection.config, deferred);

                var authService = $injector.get('AuthService');
                authService.refreshToken();

                return deferred.promise;

              } else { // no refresh token, sign in again and then go back to the current state
                NotificationService.add('warning', 'Login credentials have expired, please sign in again');
                SessionService.setRequestedState(state.current.name, state.params);
                SessionService.clearCredentials(); // notification is shown in the next block
                state.transitionTo('sign_in');
                return $q.reject(rejection);
              }
            } else if (rejection.data && rejection.data.Message.includes('is unauthorized for ' + rejection.config.headers.AppName)) {
              state.transitionTo('apps.index');
            } else {
              SessionService.clearCredentials(); // notification is shown in the next block
              state.transitionTo('sign_in');
            }
          }

        } else {
          SessionService.clearCredentials(); // notification is added in the next block
          state.transitionTo('sign_in');
        }

        if (rejection.data == null) {
          NotificationService.add("error", "An error occurred while communicating with the server, please refresh the page in few seconds");
        } else if (!avoidInterception('responseError', rejection)) {
          NotificationService.add("error", rejection.data.Message || rejection.data.error_description || rejection.data);
        }

        return $q.reject(rejection);
      }
    };

    function avoidInterception (type, httpPackage) {
      if (type === 'responseError') {
        if (httpPackage.config.config && httpPackage.config.config.ignoreError) return true;
        // model error in create DB - replaced with modal specifying the errors
        if (httpPackage.config.method === 'POST' &&
          _.startsWith(httpPackage.config.url, CONSTS.appUrl + '/admin/myAppConnection/') &&
          _.startsWith(httpPackage.data, 'Invalid schema:')) return true;

        if(_.startsWith(httpPackage.data, 'App is not ready yet')) return true;
      }
    }
  }

})();
