'use strict';

angular.module('app.routes', []).
  config(function($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $logProvider.debugEnabled(true);

    $httpProvider.interceptors.push('httpInterceptor');

    $stateProvider
      .state('sign_in', {
        url: '/sign_in',
        templateUrl:   'views/auth/sign_in.tpl.html',
        controller : 'SignInController as sign'


      })
      .state('apps', {
        url: '/apps',
        abstract: true,
        template: '<div ui-view></div>'
      });
    })
  .run(run,['$state','AuthService','$rootScope']);

function run($state,AuthService,$rootScope){

  if(!AuthService.currentUser){
    //user not log in:
      $state.go('sign_in')
  }else{
    //user logged in
      $state.go('apps.index')
    }


  // on every page load checking if the user sign in:
  $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
    if(!AuthService.currentUser) {
      //user not log in:
      $state.go('sign_in')
    }
  });


}
