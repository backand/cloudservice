
(function  () {

  angular.module('backand')
    .controller('AuthController', ['AuthService', 'SessionService', 'HttpBufferService', 'NotificationService', '$state', 'usSpinnerService', 'AuthLayoutService','$rootScope','AppsService','DatabaseService','AnalyticsService','ModelService', AuthController]);

  function AuthController(AuthService, SessionService, HttpBufferService, NotificationService, $state, usSpinnerService, AuthLayoutService, $rootScope, AppsService, DatabaseService, AnalyticsService, ModelService) {
    var self = this;

    self.flags = AuthService.flags;
    self.flags.authenticating = false;
    self.email = '';

    self.template = AuthLayoutService.flags.landing && $state.is('sign_up') ? 'views/auth/auth_landing.html' : 'views/auth/auth_regular.html';

    SessionService.clearCredentials();
    // when entering login page, reject all pending http requests which were rejected with 401
    HttpBufferService.rejectAll();

    if ($state.params.error) {
      NotificationService.add('error', JSON.parse($state.params.error).message);
    }

    $rootScope.$on('email:changed', function (event, data) {
      self.email = data; // 'Emit!'
    });

    self.socials = AuthService.socials;

    self.socialLogin = function (social) {
      self.flags.authenticating = true;
      var isSignup = false;

      if(social.requireEmail && self.email === '' && $state.current.name === 'sign_up'){
        $rootScope.$emit('no-required-email');
        self.flags.authenticating = false;
        return;
      }
      if(social.requireEmail && self.email !== '' && $state.current.name === 'sign_up') {
        isSignup = true;
      }

      usSpinnerService.spin("socialSignin");
      AuthService.socialLogin(social, isSignup, self.email, isSignup)
        .then(function (response) {
          var requestedState = SessionService.getRequestedState();
          if(isSignup && isLauncher()){
            AnalyticsService.track('SignupLauncher');
            createNewApp();
          } else {
            $state.go(requestedState.state || 'apps.index', requestedState.params);
          }
        })
        .catch(function (error) {
          self.flags.authenticating = false;
          usSpinnerService.stop("socialSignin");
          if (error.data) {
            NotificationService.add('error', error.data.error_description || error.data);
          }
        });
    }

    /**
     * @ngdoc function
     * @name createNewApp
     * @description Creates default app for current user
     *
     * @returns void
     */
    function createNewApp() {
      NotificationService.add('info', 'Creating new app...');
      AppsService.add()
          .then(function (data) {
            //get appName from response
            var appName = data.__metadata.appName;
            //track event that app is created
            AnalyticsService.track('CreatedApp', { appName: appName });
            //create App database with defaultSchema
            DatabaseService.createDB(appName, 10, '', ModelService.defaultSchema(),2)
                .success(function (data) {
                  AnalyticsService.track('CreatedNewDB', { schema: ModelService.defaultSchema() });
                  AnalyticsService.track('create app', { app: appName });
                  AppsService.resetCurrentApp();
                  AppsService
                      .getApp(appName)
                      .then(function () {
                        var stateParams = { new: 1, appName: appName };
                        if (isLauncher()) {
                          stateParams['source'] = 'launcher';
                        }
                        $state.go('functions.externalFunctions', stateParams, { reload: true });
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
