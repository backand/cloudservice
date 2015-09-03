(function () {
  'use strict';

  angular.module('common.services')
    .service('AuthService', ['SessionService', '$http', 'CONSTS', 'SocialProvidersService', '$window', '$q', 'AnalyticsService', 'HttpBufferService', AuthService]);


  function AuthService(SessionService, $http, CONSTS, SocialProvidersService, $window, $q, AnalyticsService, HttpBufferService) {

    var self = this;

    self.socials = SocialProvidersService.socialProviders;

    var signingIn = false;

    self.signIn = function (userData) {
      if (signingIn) return;
      signingIn = true;

      userData.grant_type = 'password';
      userData.appName = userData.appName || CONSTS.mainAppName;

      return signIn(userData)
        .then(function (response) {
          setCredentials(response.data, userData.username);
          HttpBufferService.retryAll(updater);
          return response.data;
        })
        .finally(function () {
          signingIn = false;
        });
    };

    self.signUp = function (fullName, email, password) {
      return signUp(fullName, email, password)
        .then(function () {
          return self.signIn({username: email, password: password})
        })
        .then(function (response) {
          AnalyticsService.identify(fullName, email);
          AnalyticsService.trackSignupEvent(fullName, email);
          return response;
        })
    };

    function signIn (userData) {
      return $http({
          method: 'POST',
          url: CONSTS.appUrl + '/token',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function (obj) {
            var str = [];
            for (var prop in obj) {
              str.push(prop + "=" + encodeURIComponent(obj[prop]));
            }
            return str.join("&");
          },
          data: userData
        }
      )
    }

    function signUp (fullName, email, password) {
      return $http({
          method: 'POST',
          url: CONSTS.appUrl + '/api/account/signUp',
          data: {
            fullName: fullName,
            email: email,
            password: password,
            confirmPassword: password
          }
        }
      )
    }

    function updater (request) {
      request.headers['Authorization'] = SessionService.getAuthHeader();
      return request;
    }

    self.refreshToken = function () {
      return self.signIn({
        username: SessionService.currentUser.username,
        refreshToken: SessionService.currentUser.refresh_token
      });
    };

    self.forgot = function (email) {
      return $http({
          method: 'POST',
          url: CONSTS.appUrl + '/api/account/SendChangePasswordLink',
          data: {
            username: email
          }
        }
      )
    };


    function getSocialUrl(social, isSignup) {
      var action = isSignup ? 'up' : 'in';
      return 'user/socialSign' + action +
        '?provider=' + social.label +
        '&response_type=token&client_id=self&redirect_uri=' + social.url +
        '&state=rcFNVUMsUOSNMJQZ%2bDTzmpqaGgSRGhUfUOyQHZl6gas%3d';
    }

    self.socialLogin = function (provider, isSignup) {
      if (typeof provider === 'string') {
        provider = _.find(self.socials, {name: provider});
      }

      //monitor when users click on social
      var st = '?st=' + (isSignup ? provider.id : '0');

      var returnAddress =  encodeURIComponent($window.location.href.replace(/\?.*/g, ''));

      self.loginPromise = $q.defer();

      self.socialAuthWindow = window.open(
        CONSTS.appUrl + '/1/' +
        getSocialUrl(provider, isSignup) +
        '&appname=' + CONSTS.mainAppName + '&returnAddress=' + returnAddress + st,
        'id1', 'left=10, top=10, width=600, height=600');

      window.addEventListener('message', setUserDataFromToken, false);
      return self.loginPromise.promise;
    };

    function setUserDataFromToken (message) {
      self.socialAuthWindow.close();
      self.socialAuthWindow = null;
      if (message.origin !== location.origin) {
        return;
      }

      var eventData = JSON.parse(message.data);
      if (eventData.error) {
        var errorData = JSON.parse(eventData.error);
        if (errorData.message === 'The user is not signed up to ' + CONSTS.mainAppName) {
          self.socialLogin(errorData.provider, true)
        }
        else {
          var errorMessage = errorData.message + ' (signing in with ' + errorData.provider + ')';

          self.loginPromise.reject({
            data: errorMessage
          });
        }
      } else if (eventData.data) {
        return self.signInWithToken(JSON.parse(eventData.data), eventData.st)
          .then(function (response) {
            self.loginPromise.resolve(response);
          });
      } else {
        self.loginPromise.reject();
      }
    }

    self.signInWithToken = function (userData, st) {
      var tokenData = {
        grant_type: 'password',
        accessToken: userData.access_token,
        appName: userData.appName
      };

      if(st != '0') { //this is sign up
         AnalyticsService.trackSignupEvent(
           tokenData.username,
           tokenData.username,
           _.find(self.socials, {id: Number(st)}));
      }

      return self.signIn(tokenData);
    };


    self.resetPassword = function (password, id) {
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

    self.changePassword = function (oldPassword, newPassword) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/user/changePassword',
        data: {
          oldPassword: oldPassword,
          newPassword: newPassword
        }
      });
    };

    function setCredentials (serverData, username) {
      serverData.username = serverData.username || username;

      SessionService.setCredentials(serverData);

      AnalyticsService.jacoIdentify(serverData.username);
      //AnalyticsService.woopraIdentify(currentUser.username, currentUser.username);
      AnalyticsService.track('session', {name: serverData.username});
      AnalyticsService.inspect(serverData.username);
    };

  }

})();
