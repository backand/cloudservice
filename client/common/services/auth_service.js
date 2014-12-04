(function() {
  'use strict';

  function AuthService($http, CONSTS) {

    var self =this;

    this.signIn = function(userName,password){
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/token',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: {
          grant_type : 'password',
          username : userName,
          password : password,
          appname : 'www'
        }
      }
      )};

    this.signUp = function(fullName, email, password){
      return $http({
          method: 'POST',
          url: CONSTS.appUrl + '/api/account/signUp',
          data: {
            fullName : fullName,
            email : email,
            password : password,
            confirmPassword : password
          }
        }
      )};

    this.forgot = function(email){
      return $http({
          method: 'POST',
          url: CONSTS.appUrl + '/api/account/SendChangePasswordLink',
          data: {
              username : email
          }
        }
      )};

    this.resetPassword = function(password, id){
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

  angular.module('common.services')
    .service('AuthService', ['$http', 'CONSTS', AuthService])

})();
