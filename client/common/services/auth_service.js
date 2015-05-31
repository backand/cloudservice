(function () {
  'use strict';

  angular.module('common.services')
    .service('AuthService', ['$http', 'CONSTS', 'SessionService', '$analytics', 'AppsService', '$intercom', '$q', AuthService]);

  function AuthService($http, CONSTS, SessionService, $analytics, AppsService, $intercom, $q) {

    var self = this;

    self.signUpAndIn = function (fullName, email, password) {

      var deferred = $q.defer();

      self.signUp(fullName, email, password)
        .then(function _signUpSuccessHandler() {

          $analytics.eventTrack('SignedUp', {"name": fullName});

          if ($intercom) {
            $intercom.boot({
              app_id: CONSTS.IntercomAppId,
              name: fullName,
              email: email,
              signed_up_at: new Date().getTime()
            });

            $intercom.trackEvent('SignedUp', {"name": fullName});
          }

          self.signIn(email, password)
            .then(function _signInSuccessHandler() {
              SessionService.setCredentials(data, email);

              //create todos sample app
              var exampleAppName = 'todo' + SessionService.getUserId();

              if (exampleAppName != 'todo0') {
                AppsService.add(exampleAppName, 'My First App - Todo list example');
              }

              deferred.resolve();
            });
        });

      return deferred.promise;

    };

    this.signIn = function (userName, password) {
      return $http({
          method: 'POST',
          url: CONSTS.appUrl + '/token',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function (obj) {
            var str = [];
            for (var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          data: {
            grant_type: 'password',
            username: userName,
            password: password,
            appname: 'www'
          }
        }
      )
    };

    this.signUp = function (fullName, email, password) {
      return $http({
          method: 'POST',
          url: CONSTS.appUrl + '/api/account/signUp',
          data: {
            fullName: fullName,
            email: email,
            password: password,
            confirmPassword: password
          }
        })
    };

    this.forgot = function (email) {
      return $http({
          method: 'POST',
          url: CONSTS.appUrl + '/api/account/SendChangePasswordLink',
          data: {
            username: email
          }
        }
      )
    };

    this.resetPassword = function (password, id) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/api/account/changePassword',
        data: {
          confirmPassword: password,
          password: password,
          token: id
        }
      });
    };

  }

})();
