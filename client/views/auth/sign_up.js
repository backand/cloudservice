(function () {

  angular.module('backand')
    .controller('SignUpController', ['AuthService', '$state', 'SessionService', '$timeout', 'NotificationService', '$rootScope', 'AppsService', 'ModelService', 'AnalyticsService', 'DatabaseService', SignUpController]);

  function SignUpController(AuthService, $state, SessionService, $timeout, NotificationService, $rootScope, AppsService, ModelService, AnalyticsService, DatabaseService) {

    var self = this;

    (function init() {
      self.flags = AuthService.flags;
      self.loading = false;
      self.twitterMissingEmail = false;
      //self.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
      self.emailFormat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


      //for automatic sign up
      if ($state.params.i == 1) {
        self.fullName = $state.params.name;
        self.email = $state.params.username;
        self.password = Math.random().toString(36).substring(7);
        self.repassword = self.password;
        $timeout(function () {
          self.signUp();
        }, 100);
      }
    }());

    self.emailChanged = function (email) {
      self.twitterMissingEmail = false;
      if (email.$valid) {
        $rootScope.$emit('email:changed', email.$viewValue);
      }
    };

    $rootScope.$on('no-required-email', function (event, data) {
      self.twitterMissingEmail = true;
    });

    /**
     * @ngdoc function
     * @name signUp
     * @description Register new user
     * - check if signup url carried `launcher= 1` param in URL
     * - Create a default app
     * @see createNewApp anf Helper function used to handle application creation process
     * @public
     * 
     * @modifiedby Mohan Singh<mslogicmaster@gmail.com>
     * @return void
     */
    self.signUp = function () {
      self.flags.authenticating = true;
      self.loading = true;
      AuthService.signUp(self.fullName, self.email, self.password)
        .then(function (response) {
          if (isLauncher()) {
            createNewApp(self.email);
            return;
          }
          var requestedState = SessionService.getRequestedState();
          $state.go(requestedState.state || 'apps.index', requestedState.params);
        })
        .catch(function (data) {
          self.flags.authenticating = false;
          self.loading = false;
          if (data) {
            self.error = data.error_description;
            $timeout(function () {
              self.error = undefined;
            }, 3000);
          }
        });
    };

    /**
     * @ngdoc function
     * @name emailToAppName
     * @description A Helper function which takes an emailId and returns appName
     * 
     * @param {string} email 
     * 
     * @todo This should be removed, once API starts sending appName in response
     * @returns {string} A appName
     */
    function emailToAppName(email) {
      var emailSegments,
        appName;
      emailSegments = email.split('@');
      appName = emailSegments[0] + 'app1';

      return appName;
    }

    /**
     * @ngdoc function
     * @name createNewApp
     * @description Creates default app for current user
     * 
     * @todo remove email param when create APP API starts sending appName in response
     * @param {any} email 
     */
    function createNewApp(email) {
      NotificationService.add('info', 'Creating new app...');
      AppsService.add()
        .then(function (data) {
          /**
           * @todo use appName from API response
           * for now - API does not return appName so creating it mannually
           * var appName = emailToAppName(email); would be replaced with var appName = response.data.appName;
           */
          var appName = emailToAppName(email);
          //track event that app is created
          AnalyticsService.track('CreatedApp', { appName: appName });
          //create App database with defaultSchema
          DatabaseService.createDB(appName, 10, '', ModelService.defaultSchema())
            .success(function (data) {
              AnalyticsService.track('CreatedNewDB', { schema: ModelService.defaultSchema() });
              AnalyticsService.track('create app', { app: appName });
              AppsService.resetCurrentApp();
              AppsService
                .getApp(appName)
                .then(function () {
                  $state.go('functions.externalFunctions', { new: 1, appName: appName }, { reload: true });
                });
            });
        });
    }

    /**
     * @ngdoc function
     * @name isLauncher
     * @description checks if launcher = 1 param exists in URL
     * 
     * @returns {boolean}
     */
    function isLauncher() {
      var launcher = $state.params.launcher;
      return (typeof launcher !== 'undefined') && (launcher == 1);
    }

  }

}());














