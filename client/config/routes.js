'use strict';

angular.module('app.routes', []).
  config(function($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $logProvider.debugEnabled(true);

    $httpProvider.interceptors.push('httpInterceptor');

    $stateProvider
      .state('sign_in', {
        url: '/sign_in',
        templateUrl: 'views/auth/sign_in.tpl.html'
      })
      .state('apps', {
        url: '/apps',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('apps.index', {
        url: '',
        controller: 'AppsIndexController',
        templateUrl: 'views/apps/index.tpl.html'
      });
    });
