
(function  () {

  angular.module('backand')
    .controller('AuthController', ['AuthService', '$state', 'SessionService', 'NotificationService', '$location', AuthController]);

  function AuthController(AuthService, $state, SessionService, NotificationService, $location) {
    var self = this;

    var queryString = window.location.search.substring(1);

    var errorLocation = queryString.indexOf('error=');
    if (errorLocation > -1) {
      NotificationService.add('error', JSON.parse(decodeURIComponent(queryString.substring(errorLocation + 6))).message);
    }

    var dataLocation = queryString.indexOf('data=');
    if (dataLocation > -1) {
      var data = JSON.parse(decodeURIComponent(queryString.substring(dataLocation + 5)));
      SessionService.setCredentials(data);
      $state.go('apps.index');
    }

    self.socials = AuthService.socials;

    self.socialLogin = function (social) {
      AuthService.socialLogin(social);
    }

  }

}());
