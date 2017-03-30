(function () {

  angular.module('backand')
    .controller('KeysController', ['$scope', 'CONSTS','NotificationService', 'AppsService', 'socialProviders', 'ConfirmationPopup', KeysController]);

  function KeysController($scope, CONSTS, NotificationService, AppsService, socialProviders, ConfirmationPopup) {

    var self = this;

    function init() {
      self.socialProviders = angular.copy(socialProviders);
      self.appName = AppsService.currentApp.Name;
      getAppSettings();
      AppsService.appKeys(self.appName)
        .then(setKeysInfo, errorHandler);
      $scope.$watch('keys', updateAppSettings, true);
    }

    var settings = ['enable', 'clientId', 'clientSecret', 'Oauth2EndPoint', 'Scope'];

    self.displayedTokens = [
      {
        name: 'general',
        label: 'Master',
        description: 'Use this token to access without username and password. The master token must sent with the user\'s token',
        helpKey: "socialAndKeysMasterToken"
      },
      {
        name: 'signup',
        label: 'API Sign-up',
        description: 'Use this token when registering a user via the sign-up REST API URL - ' +
        '/user/signup (put it in headers parameter SignUpToken)',
        helpKey: "socialAndKeysAPISignupToken"
      }
    ];

    self.resetKey = function(key){
      ConfirmationPopup.confirm('After reset, you need to update all the relevant code associated with it.', 'Reset', 'Cancel')
        .then(function (result) {
          if (result) {
            self.reseting = key;
            AppsService.resetAppKey(self.appName, key)
              .then(function (response) {
                self.tokens[key] = response.data;
                self.reseted = key;
                self.reseting = false;
              });

          }
        });
    };

    self.tokenExpirations = [
      {label: '10 Hours', seconds: 36000},
      {label: '1 Day', seconds: 86400},
      {label: '1 Week', seconds: 604800},
      {label: '1 Month', seconds: 2592000},
      {label: 'Never - Use Refresh Token', seconds: false}
    ];

    var TOKEN_EXPIRATION_WITH_REFRESH = 86400;

    function getAppSettings () {
      self.socialProviders.forEach(function (socialProvider) {
        settings.forEach(function (setting) {
          socialProvider[setting] = AppsService.currentApp.settings[getSettingKey(setting, socialProvider)];
        });
        syncSocialKeys(socialProvider);
        setUseOwnApp(socialProvider);
      });
      setTokenExpiration();
      self.appSettings = AppsService.currentApp.settings;
    }

    function getSettingKey (setting, socialProvider) {
      return setting === 'enable' ?
        'enable' + _.capitalize(socialProvider.name) :
        socialProvider.name + _.capitalize(setting);
    }

    function setTokenExpiration () {
      self.useRefreshToken = AppsService.currentApp.settings.useRefreshToken;
      self.tokenExpiration = self.useRefreshToken ? false : AppsService.currentApp.settings.tokenExpiration;
    }

    function setKeysInfo(data){
      self.tokens = data.data;
    }

    self.useOwnAppChange = function (socialProvider) {
      if (!socialProvider.useOwnApp) {
        socialProvider.clientSecret = socialProvider.clientId = null;
      }
      else {
        angular.extend(socialProvider, socialProvider.temp);
      }
      self.updateSocialSettings(socialProvider);
    };

    function syncSocialKeys (socialProvider) {
      if (socialProvider.clientSecret || socialProvider.clientId) {
        socialProvider.temp = {
          clientSecret: socialProvider.clientSecret,
          clientId: socialProvider.clientId
        }
      }
    }

    function setUseOwnApp (socialProvider) {
      socialProvider.useOwnApp = !!socialProvider.clientSecret || !!socialProvider.clientId;
    }

    self.updateTokenExpire = function () {
      self.errorUpdate = false;
      var appSettings = {};

      appSettings.useRefreshToken = !self.tokenExpiration;
      appSettings.tokenExpiration = self.tokenExpiration || TOKEN_EXPIRATION_WITH_REFRESH;

      updateSettings(appSettings);
    };

    function updateAppSettings(newVal, oldVal) {

      if(oldVal == null)
        return;

      if (self.socialForm.$invalid)
        return;

      if(newVal.appSettings.returnAddressURIs !== oldVal.appSettings.returnAddressURIs){
        updateSettings(newVal.appSettings);
      }

    }

    self.updateSocialSettings = function (socialProvider) {
      self.errorUpdate = false;
      var appSettings = {};

      syncSocialKeys(socialProvider);
      settings.forEach(function (setting) {
        appSettings[getSettingKey(setting, socialProvider)] = socialProvider[setting];
      });

      updateAdditionalSettings(appSettings);

      updateSettings(appSettings);
    };

    function updateAdditionalSettings(appSettings){

      //for ADFS save the resource
      appSettings['adfsResource'] = CONSTS.adfsResourse;

    }

    function updateSettings (appSettings) {
      AppsService.update(self.appName, {settings: appSettings})
        .then(updateSuccess, errorHandler);
    }

    function updateSuccess() {
      NotificationService.add('success', 'Data saved');
    }

    function errorHandler(error, message) {
      NotificationService.add('error', message);
      self.errorUpdate = true;
    }

    init();
  }

}());
