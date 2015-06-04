(function () {
  'use strict';

  function AuthService($http, CONSTS, SessionService) {

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

    self.getUserId = function () {
      if (SessionService.currentUser && SessionService.currentUser.userId)
        return SessionService.currentUser.userId;
      else
        return 0;
    };

  }

  angular.module('common.services')
    .service('AuthService', ['$http', 'CONSTS', 'SessionService', AuthService])

})();
