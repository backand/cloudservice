(function () {
  'use strict';

  function AuthService($http, CONSTS, SessionService, SocialProvidersService, $window, $q, $state, $analytics) {

    var self = this;

    self.signIn = function (userData) {
      userData.grant_type = 'password';
      userData.appName = userData.appName || CONSTS.mainAppName;

      return $http({
          method: 'POST',
          url: CONSTS.appUrl + '/token',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function (obj) {
            var str = [];
            for (var prop in obj) {
              str.push(prop + "=" + obj[prop]);
            }
            return str.join("&");
          },
          data: userData
        }
      )
    };

    self.signUp = function (fullName, email, password) {
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

    self.socials = SocialProvidersService.socialProviders;

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
        return self.signInWithToken(JSON.parse(eventData.data), eventData.st);
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
        self.trackSignupEvent(tokenData.username, tokenData.username, st);
      }

      self.signIn(tokenData)
        .success(function (data) {
          SessionService.setCredentials(data);
          // requestedState will be empty because the app was redirected to.
          // This will change when social sign in will happen with pop up
          var requestedState = SessionService.getRequestedState();
          $state.go(requestedState.state || 'apps.index', requestedState.params);
        });
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

    self.getUserId = function () {
      return SessionService.getUserId();
    };

    self.trackSignupEvent = function(fullName, email, sId){

      var social = _.find(self.socials, {id: Number(sId)});
      var socialName = social ? social.name : 'self';
      analytics.identify(email, {
        name: fullName,
        email: email,
        signed_up_at: new Date().getTime()
      });
      $analytics.eventTrack('SignedUp', {name: fullName});
      $analytics.eventTrack('SocialSignedUp', {provider: socialName});

    }

  }

  angular.module('common.services')
    .service('AuthService', ['$http', 'CONSTS', 'SessionService', 'SocialProvidersService', '$window', '$q', '$state', '$analytics', AuthService])

})();
