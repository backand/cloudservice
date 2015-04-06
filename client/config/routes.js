'use strict';

angular.module('backand.routes', []).
  config(function($stateProvider, $urlRouterProvider, $uiViewScrollProvider, $logProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');
    $uiViewScrollProvider.useAnchorScroll();

    $logProvider.debugEnabled(true);

    $httpProvider.interceptors.push('httpInterceptor');

    $stateProvider
      .state('sign_up', {
        url: '/sign_up',
        templateUrl: 'views/auth/sign_up.html',
        controller : 'SignUpController as signup'
      })
      .state('sign_in', {
        url: '/sign_in',
        templateUrl: 'views/auth/sign_in.tpl.html',
        controller : 'SignInController as sign'
      })
      .state('change_password', {
        url: '/apps/#/change_password',
        templateUrl: 'views/auth/change_password.html',
        controller : 'changePasswordController as change'
      })
      .state('session', {
        url: '/',
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
        template: '<ui-view autoscroll="true"/>'
      })
      .state('app', {
        url: 'app/:appName',
        parent: 'session',
        abstract: true,
        template: '<ui-view autoscroll="true"/>',
        resolve: {
          appItem: ['AppsService', '$stateParams', function (AppsService, $stateParams) {
              return AppsService.getApp($stateParams.appName);
          }]
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
        url: '/tables',
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
      .state('security', {
        url: '/security',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('dbQueries', {
        url: '/dbQueries',
        parent: 'app',
        abstract: true,
        template: '<div ui-view></div>'
      });
  })
  .run(['$rootScope', '$state', 'SessionService', run]);

function isStateForSignedOutUser(state) {
  return (state.name === 'sign_in' || state.name === 'sign_up' || state.name === 'change_password');
}

function run($rootScope, $state, SessionService) {
  $rootScope.$on('$stateChangeStart', function (event, toState) {
    if (!SessionService.currentUser) {
      if (!isStateForSignedOutUser(toState)) {
        event.preventDefault();
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
