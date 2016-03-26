
(function  () {

  angular.module('backand')
    .controller('SocialSignupEmailController', ['$modalInstance', SocialSignupEmailController]);

  function SocialSignupEmailController($modalInstance) {
    var self = this;

    self.submit = function () {
      // TODO send email to server
      $modalInstance.close();
    };

    self.cancel = function () {
      $modalInstance.dismiss();
    }
  }

}());
