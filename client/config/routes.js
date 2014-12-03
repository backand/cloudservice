'use strict';

angular.module('app.routes', []).
  config(function($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $logProvider.debugEnabled(true);

    $httpProvider.interceptors.push('httpInterceptor');

    $stateProvider
      .state('sign_in', {
        url: '/sign_in',
        templateUrl: 'views/auth/sign_in.tpl.html',
        controller : 'SignInController as sign'
      })
      .state('sign_up', {
        url: '/sign_up',
        templateUrl: 'views/auth/sign_up.html',
        controller : 'SignUpController as signup'
      })
      .state('change_password', {
        url: '/change_password',
        templateUrl: 'views/auth/change_password.html',
        controller : 'changePasswordController as change'
      })
      .state('apps', {
        url: '/',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('database', {
        url: '/database',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('dashboard', {
        url: '/dashboard',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('playground', {
        url: '/playground',
        abstract: true,
        template: '<div ui-view></div>'
    });
    })
  .run(run,['$state','AuthService', '$rootScope']);

function run($state,SessionService, $rootScope){
  if (!SessionService.currentUser){
    $state.go('sign_in')
  } else {
    $state.go('apps.index')
  }

}
