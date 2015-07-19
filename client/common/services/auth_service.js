(function () {
  'use strict';

  function AuthService($http, CONSTS, SessionService, $window, $analytics) {

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

    self.socials = [
      {name: 'github', label: 'Github', url: 'www.github.com', css: 'github', id:1},
      {name: 'google', label: 'Google', url: 'www.google.com', css: 'google-plus', id:2},
      {name: 'facebook', label: 'Facebook', url: 'www.facebook.com', css: 'facebook', id:3}
    ];

    function getSocialUrl(social, isSignup) {
      var action = isSignup ? 'up' : 'in';
      return 'user/socialSign' + action +
        '?provider=' + social.label +
        '&response_type=token&client_id=self&redirect_uri=' + social.url +
        '&state=rcFNVUMsUOSNMJQZ%2bDTzmpqaGgSRGhUfUOyQHZl6gas%3d';
    }

    self.socialLogin = function (social, isSignup) {
      if (typeof social === 'string') {
        social = _.find(self.socials, {name: social});
      }

      //monitor when users click on social
      var st = '?st=0';
      if(isSignup)
      {
        //send indication if it coming from sign-up
        st = "?st=" + social.id;
      }

      var returnAddress =  encodeURIComponent($window.location.href.replace(/\?.*/g, ''));
      $window.location.href = CONSTS.appUrl + '/1/' +
        getSocialUrl(social, isSignup) +
        '&appname=' + CONSTS.mainAppName +
        '&returnAddress=' + returnAddress + st;

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
    .service('AuthService', ['$http', 'CONSTS', 'SessionService', '$window','$analytics',  AuthService])

})();
