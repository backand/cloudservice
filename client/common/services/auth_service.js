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
          appname : 'northwindqa55sql'
        }
      }
      )};
  }

  angular.module('common.services')
    .service('AuthService', ['$http', 'CONSTS', AuthService])

})();
