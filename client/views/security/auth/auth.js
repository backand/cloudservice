/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityAuth($stateParams, NotificationService, SecurityService, AppsService, $scope, $state) {

    var self = this;
    (function init() {
      self.appName = SecurityService.appName = AppsService.appName = $stateParams.name;
      self.data = {settings: {}, allowAnonymous: false};
      self.updateAppAuth = updateAppAuth;
      //secureLevel= "RegisteredUsers";
      loadConfigurationData();

    }());

    function loadConfigurationData() {
      AppsService.getCurrentApp(self.appName).then(setDbInfo, errorHandler);

      SecurityService.getRoles().then(rolesSuccessHandler, errorHandler);
    }

    function rolesSuccessHandler(data) {
      self.roles = data.data.data;
    }

    function setDbInfo(data) {
      self.data.settings = data.settings;
      self.data.allowAnonymous = self.data.settings.secureLevel == "AllUsers";

      AppsService.appKeys(self.appName).then(setKeysInfo, errorHandler);
      $scope.$watch('auth', updateAppAuth, true);
    }

    function setKeysInfo(data){
      self.keys = data.data;
    }

    self.goTo = function(state) {
      $state.go(state, {name: this.appName});
    };

    function updateAppAuth(newVal, oldVal) {

      if(oldVal == null)
        return;

      if(newVal.data.allowAnonymous !== oldVal.data.allowAnonymous ||
        newVal.data.settings.defaultGuestRole !== oldVal.data.settings.defaultGuestRole ||
        newVal.data.settings.newUserDefaultRole !== oldVal.data.settings.newUserDefaultRole ||
        newVal.data.settings.registrationRedirectUrl !== oldVal.data.settings.registrationRedirectUrl ||
        newVal.data.settings.signInRedirectUrl !== oldVal.data.settings.signInRedirectUrl ||
        newVal.data.settings.enableUserRegistration !== oldVal.data.settings.enableUserRegistration
      ) {
        if (newVal.data.allowAnonymous)
          self.data.settings.secureLevel = "AllUsers";
        else
          self.data.settings.secureLevel = "RegisteredUsers";

        AppsService.update(self.appName, self.data).then(updateSuccess,errorHandler);

      }

    }

    function updateSuccess() {
      NotificationService.add('success', 'Data saved');
    }

    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }
  }

  angular.module('app')
    .controller('SecurityAuth', [
      '$stateParams',
      'NotificationService',
      'SecurityService',
      'AppsService',
      '$scope',
      '$state',
      SecurityAuth
    ]);

}());
