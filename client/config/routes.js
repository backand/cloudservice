'use strict';

angular.module('app.routes', []).
  config(function($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

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
      //.state('change_password', {
      //  url: '/change_password',
      //  templateUrl: 'views/auth/change_password.html',
      //  controller : 'changePasswordController as change'
      //})
      .state('apps', {
        url: '/',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('getting-started-open', {
        url: '/docs/start',
        templateUrl: 'views/api_playground/get-started-open.html',
        controller: 'Docs as docs'
      })
      .state('kickstart-open', {
        url: '/docs/kickstart',
        templateUrl: 'views/api_playground/kickstart-open.html'
      })
      .state('api-desc-open', {
        url: '/docs/api',
        templateUrl: 'views/api_playground/api-desc.html'
      })
      .state('database', {
        url: '/database',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('backoffice', {
        url: '/backoffice',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('playground', {
        url: '/playground',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('tables', {
        url: '/tables',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('log', {
        url: '/log',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('security', {
        url: '/security',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('dbQueries', {
        url: '/dbQueries',
        abstract: true,
        template: '<div ui-view></div>'
      });
  })
  .run(['$rootScope', '$state', 'SessionService', run]);

function isStateForSignedOutUser(state) {
  return (state.name === 'sign_in' || state.name === 'sign_up');
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
