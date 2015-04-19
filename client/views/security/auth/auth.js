/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityAuth($state, NotificationService, SecurityService, AppsService, RulesService, DictionaryService, $scope) {

    var self = this;
    (function init() {
      self.appName = SecurityService.appName = AppsService.appName = $state.params.appName;
      self.data = {settings: {}, allowAnonymous: false};
      self.updateAppAuth = updateAppAuth;
      loadConfigurationData();

    }());

    function loadConfigurationData() {
      setDbInfo(AppsService.currentApp);

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

      //enable here the rules tab only for 'v_durados_user'
      RulesService.appName = DictionaryService.appName = self.appName;
      RulesService.tableId = 4;
      DictionaryService.tableName = 'v_durados_user';
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

  angular.module('backand')
    .controller('SecurityAuth', [
      '$state',
      'NotificationService',
      'SecurityService',
      'AppsService',
      'RulesService',
      'DictionaryService',
      '$scope',
      SecurityAuth
    ]);

}());
