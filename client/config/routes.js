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
      .state('apps', {
        url: '/apps',
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

  // on every page load checking if the user sign in:
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if (!SessionService.currentUser) {
      $state.go('sign_in')
    }
  });
}
