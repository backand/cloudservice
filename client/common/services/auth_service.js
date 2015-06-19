(function () {
  'use strict';

  function AuthService($http, CONSTS, SessionService, $window) {

    var self = this;

    self.signIn = function (userName, password) {
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
          data: {
            grant_type: 'password',
            username: userName,
            password: password,
            appname: CONSTS.mainAppName
          }
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
      {name: 'github', label: 'Github', url: 'www.github.com', css: 'github'},
      {name: 'google', label: 'Google', url: 'www.google.com', css: 'google-plus'},
      {name: 'facebook', label: 'Facebook', url: 'www.facebook.com', css: 'facebook'}
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

      var returnAddress =  encodeURIComponent($window.location.href.replace(/\?.*/g, ''));
      $window.location.href = CONSTS.appUrl + '/1/' +
        getSocialUrl(social, isSignup) +
        '&appname=' + CONSTS.mainAppName +
        '&returnAddress=' + returnAddress;
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

  }

  angular.module('common.services')
    .service('AuthService', ['$http', 'CONSTS', 'SessionService', '$window', AuthService])

})();
