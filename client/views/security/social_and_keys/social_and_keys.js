(function () {

  angular.module('backand')
    .controller('KeysController', ['NotificationService', 'AppsService', 'socialProviders', 'ConfirmationPopup', KeysController]);

  function KeysController(NotificationService, AppsService, socialProviders, ConfirmationPopup) {

    var self = this;
    function init() {
      self.socialProviders = angular.copy(socialProviders);
      self.appName = AppsService.currentApp.Name;
      getAppSettings();
      AppsService.appKeys(self.appName)
        .then(setKeysInfo, errorHandler);
    }

    var settings = ['enable', 'clientId', 'clientSecret'];

    self.displayedTokens = [
      {
        name: 'general',
        label: 'Master',
        description: 'Use this token to access without username and password. The master token must sent with the user\'s token'
      },
      {
        name: 'signup',
        label: 'API Sign-up',
        description: 'Use this token when registering a user via the sign-up REST API URL - ' +
        '/user/signup (put it in headers parameter SignUpToken)'
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

    function getAppSettings () {
      self.socialProviders.forEach(function (socialProvider) {
        settings.forEach(function (setting) {
          socialProvider[setting] = AppsService.currentApp.settings[getSettingKey(setting, socialProvider)];
        });
        syncSocialKeys(socialProvider);
        setUseBackandApp(socialProvider);
      })
    }

    function getSettingKey (setting, socialProvider) {
      return setting === 'enable' ?
        'enable' + _.capitalize(socialProvider.name) :
        socialProvider.name + _.capitalize(setting);
    }

    function setKeysInfo(data){
      self.tokens = data.data;
    }

    self.useBackandAppChange = function (socialProvider) {
      if (socialProvider.useBackandApp) {
        socialProvider.clientSecret = socialProvider.clientId = null;
      }
      else {
        angular.extend(socialProvider, socialProvider.temp);
      }
      self.updateSettings();
    };

    function syncSocialKeys (socialProvider) {
      if (socialProvider.clientSecret && socialProvider.clientId) {
        socialProvider.temp = {
          clientSecret: socialProvider.clientSecret,
          clientId: socialProvider.clientId
        }
      }
    }

    function setUseBackandApp (socialProvider) {
      if (!socialProvider.clientSecret && !socialProvider.clientId) {
        socialProvider.useBackandApp = true;
      }
    }

    self.updateSettings = function () {
      self.errorUpdate = false;
      var appSettings = {};

      self.socialProviders.forEach(function (socialProvider) {
        syncSocialKeys(socialProvider);
        settings.forEach(function (setting) {
          appSettings[getSettingKey(setting, socialProvider)] = socialProvider[setting];
        });
      });
      AppsService.update(self.appName, {settings: appSettings})
        .then(updateSuccess, errorHandler);
    };

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
