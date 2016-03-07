(function () {

  angular.module('backand')
    .controller('LinkEmailController', ['AuthService', 'NotificationService', LinkEmailController]);

  function LinkEmailController(AuthService, NotificationService) {

    var self = this;

    (function init() {
      self.flags = AuthService.flags;
      self.loading = false;

    }());

    self.link = function () {
      // TODO: use server side link function. Log in after success, show error if failed
    };


  }

}());














