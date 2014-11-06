'use strict';

angular.module('app.routes', []).
  config(function($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');
    $logProvider.debugEnabled(true);
    $httpProvider.interceptors.push('httpInterceptor');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home/home.tpl.html',
        controller: 'HomeCtrl as home',
        resolve: {
          data: function(DataService) {
            return DataService.get();
          }
        }
      });
    });
