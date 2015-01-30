/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityAuth($stateParams, NotificationService, SecurityService, AppsService, $scope) {

    var self = this;
    (function init() {
      self.appName = SecurityService.appName = AppsService.appName = $stateParams.name;
      self.data = {settings: {}, allowAnonymous: false, privateApp: false};
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
      self.data.privateApp = !self.data.settings.enableUserRegistration;

      $scope.$watch('auth', updateAppAuth, true);
    }

    function updateAppAuth(newVal, oldVal) {

      if(oldVal == null)
        return;

      if(newVal.data.allowAnonymous !== oldVal.data.allowAnonymous ||
        newVal.data.privateApp !== oldVal.data.privateApp ||
        newVal.data.settings.defaultGuestRole !== oldVal.data.settings.defaultGuestRole ||
        newVal.data.settings.newUserDefaultRole !== oldVal.data.settings.newUserDefaultRole ||
        newVal.data.settings.registrationRedirectUrl !== oldVal.data.settings.registrationRedirectUrl ||
        newVal.data.settings.signInRedirectUrl !== oldVal.data.settings.signInRedirectUrl
      ) {
        if (newVal.data.allowAnonymous)
          self.data.settings.secureLevel = "AllUsers";
        else
          self.data.settings.secureLevel = "RegisteredUsers";

        if (newVal.data.privateApp != oldVal.data.privateApp)
          self.data.settings.enableUserRegistration = !newVal.data.privateApp;

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
      SecurityAuth
    ]);

}());
