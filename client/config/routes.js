'use strict';

angular.module('backand.routes', []).
  config(function($stateProvider, $urlRouterProvider, $uiViewScrollProvider, $logProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $uiViewScrollProvider.useAnchorScroll();

    $logProvider.debugEnabled(true);

    $httpProvider.interceptors.push('httpInterceptor');

    $stateProvider
      .state('auth', {
        url: '?data&error&email',
        templateUrl: 'views/auth/auth.html',
        abstract: true,
        controller : 'AuthController as Auth'
      })
      .state('sign_up', {
        parent: 'auth',
        url: '/sign_up?username&name&i&token&launcher',
        templateUrl: 'views/auth/sign_up.html',
        controller : 'SignUpController as signup'
      })
      .state('sign_in', {
        parent: 'auth',
        url: '/sign_in?launcher',
        templateUrl: 'views/auth/sign_in.html',
        controller : 'SignInController as signin'
      })
      .state('link_email', {
        parent: 'auth',
        url: '/link_email',
        templateUrl: 'views/auth/link_email.html',
        controller : 'LinkEmailController as linkEmail'
      })
      .state('change_password', {
        url: '/change_password',
        templateUrl: 'views/auth/reset_password.html',
        controller : 'resetPasswordController as change'
      })
      .state('account.billing', {
        url: '/billing',
        controller: 'BillingPortalController as vm',
        templateUrl: 'views/account/billing_portal.html'
      })
      .state('session', {
        url: '/?:launcher',
        abstract: true,
        controller: 'MainController as main',
        templateUrl: 'views/shared/main_view.html',
        resolve: {
          appsList: ['AppsService', function (AppsService) {
            return AppsService.all();
          }]
        }
      })
      .state('apps', {
        url: '',
        parent: 'session',
        abstract: true,
        template: '<ui-view autoscroll="true"/>',
        onEnter: function (AppsService) {
          AppsService.resetCurrentApp();
        }
      })
      .state('app', {
        url: 'app/:appName',
        parent: 'session',
        template: '<ui-view autoscroll="true"/>',
        resolve: {
          appItem: ['AppsService', '$stateParams', '$state', function (AppsService, $stateParams, $state) {
              return AppsService.getApp($stateParams.appName)
                .catch(function (error) {
                  $state.go('apps.index');
                });
          }]
        },
        controller: function ($state, appItem, AppsService, usSpinnerService) {
          var state;
          var appStatus = appItem.DatabaseStatus;
          if ($state.current.name === 'app') {
            if (appStatus == 2) {
              state = 'docs.get-started';
            }
            else if (appStatus == 0) {
              state = 'database.edit';
            }
            else if (AppsService.isExampleApp(appItem)) {
              state = 'playground.todo'
            }
            else {
              state = 'app.show';
            }
            $state.go(state)
              .then(function () {
                usSpinnerService.stop('loading-app');
              });
          }
        }
      })
      .state('database', {
        url: '/database',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('backoffice', {
        url: '/backoffice',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('playground', {
        url: '/playground',
        parent: 'app',
        abstract: true,
        template: '<ui-view autoscroll="true"/>'
      })
      .state('tables', {
        url: '/objects',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('analytics', {
        url: '/analytics',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('log', {
        url: '/log',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('functions', {
        url: '/functions',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('security', {
        url: '/security',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('dbQueries', {
        url: '/queries',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('hosting', {
        url: '/hosting',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('cronJobs', {
        url: '/cron',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      });
  })
  .run(['$rootScope', '$state', 'SessionService', 'AuthService', 'CONSTS','$window', run]);

function isStateForSignedOutUser(state) {
  return (state.name === 'sign_in' || state.name === 'sign_up' || state.name === 'change_password');
}

function run($rootScope, $state, SessionService, AuthService, CONSTS, $window) {

  if (CONSTS.env === 'DEV') {
    $rootScope.$on("$stateChangeError", console.log.bind(console));
  }

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    if (toParams.data || toParams.error) {
      event.preventDefault();

      if (toParams.error) {
        var errorData = JSON.parse(toParams.error);
        console.log(toParams);

        if (errorData.message === 'The user is not signed up to ' + CONSTS.mainAppName) {
          AuthService.socialLogin(errorData.provider, true, toParams.email);
        }
        else {
          window.close();

          //build better error message
          var err = errorData.message;

          if(err.indexOf('NO_EMAIL_SOCIAL') > -1)
              err = "Sign up with social requires a valid email";
          else if (err.indexOf('The user already signed up') > -1)
              err = "The email is already been used";

          $window.opener.alert(err);
        }
      } else if (window.opener) {
        window.opener.postMessage(JSON.stringify(toParams), location.origin);
      }
    }

    if (!SessionService.currentUser) {
      if (!isStateForSignedOutUser(toState)) {
        event.preventDefault();
        SessionService.setRequestedState(toState, toParams);
        $state.go('sign_in');
      }
    } else {
      if (isStateForSignedOutUser(toState)) {
        event.preventDefault();
        $state.go('apps.index');
      }
    }
  });
}
