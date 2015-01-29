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

    $scope.$watch('auth', updateAppAuth, true);
    function updateAppAuth(newVal, oldVal, scope) {

      if (!oldVal.data.settings.__metadata)
        return;
      var data = angular.copy(newVal);
      if (newVal.data.allowAnonymous)
        data.data.settings.secureLevel = "AllUsers";
      else
        data.data.settings.secureLevel = "RegisteredUsers";
      if (newVal.data.privateApp != oldVal.data.privateApp)
        data.data.settings.enableUserRegistration = !newVal.data.privateApp;
      AppsService.update(self.appName, data.data);

    }

    function loadConfigurationData() {
      AppsService.getCurrentApp(self.appName).then(setDbInfo, errorHandler);

      SecurityService.getRoles().then(rolesSuccessHandler, errorHandler);
    }

    function rolesSuccessHandler(data) {
      self.roles = data.data.data;
    }

    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }

    function setDbInfo(data) {
      self.data.settings = data.settings;

      self.data.allowAnonymous = self.data.settings.secureLevel == "AllUsers";
      self.data.privateApp = !self.data.settings.enableUserRegistration;
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
