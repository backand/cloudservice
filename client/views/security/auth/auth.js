/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityAuth($state, NotificationService, SecurityService, AppsService, RulesService, DictionaryService, $scope, CONSTS) {

    var self = this;
    (function init() {
      self.appName = SecurityService.appName = AppsService.appName = $state.params.appName;

      self.data = {settings: {}, allowAnonymous: false};
      self.updateAppAuth = updateAppAuth;
      loadConfigurationData();

    }());

    function loadConfigurationData() {
      SecurityService.getRoles().then(rolesSuccessHandler, errorHandler);
    }

    function rolesSuccessHandler(data) {
      self.roles = _.reject(data.data.data, {Name: 'Admin'});
      setDbInfo(AppsService.currentApp);
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
      $state.go(state);
    };

    function updateAppAuth(newVal, oldVal) {

      if(oldVal == null)
        return;

      if (self.authForm.$invalid)
        return;

      if(newVal.data.allowAnonymous !== oldVal.data.allowAnonymous ||
        newVal.data.settings.defaultGuestRole !== oldVal.data.settings.defaultGuestRole ||
        newVal.data.settings.newUserDefaultRole !== oldVal.data.settings.newUserDefaultRole ||
        newVal.data.settings.registrationRedirectUrl !== oldVal.data.settings.registrationRedirectUrl ||
        newVal.data.settings.signInRedirectUrl !== oldVal.data.settings.signInRedirectUrl ||
        newVal.data.settings.enableUserRegistration !== oldVal.data.settings.enableUserRegistration ||
        newVal.data.settings.forgotPasswordUrl !== oldVal.data.settings.forgotPasswordUrl ||
        newVal.data.settings.signupEmailVerification !== oldVal.data.settings.signupEmailVerification ||
        newVal.data.settings.enableTokenRevokation !== oldVal.data.settings.enableTokenRevokation
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

  angular.module('backand')
    .controller('SecurityAuth', [
      '$state',
      'NotificationService',
      'SecurityService',
      'AppsService',
      'RulesService',
      'DictionaryService',
      '$scope',
      'CONSTS',
      SecurityAuth
    ]);

}());
