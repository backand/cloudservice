(function() {
  'use strict';

  angular.module('backand')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('security.users', {
        url: '/users',
        templateUrl: 'views/security/user/default_tpl.html',
        controller : 'RegisteredUserController as userCtrl',
      })
      .state('security.team', {
        url: '/team',
        templateUrl: 'views/security/user/default_tpl.html',
        controller : 'TeamController as userCtrl',
      })
      .state('security.templates', {
        url: '/templates',
        controller: 'SecurityWorkspace as securityws',
        templateUrl: 'views/security/workspace/workspace.html'
      })
      .state('security.keys', {
        url: '/social_and_keys',
        controller: 'KeysController as keys',
        templateUrl: 'views/security/social_and_keys/social_and_keys.html',
        resolve: {
          socialProviders: ['SocialProvidersService', function (SocialProvidersService) {
            return SocialProvidersService.socialProviders;
          }]
        }
      })
      .state('security.auth', {
        url: '/auth',
        controller: 'SecurityAuth as auth',
        templateUrl: 'views/security/auth/auth.html'

      })
      .state('security.actions', {
        url: '/actions/:actionId?',
        controller: 'SecurityActions as actions',
        templateUrl: 'views/security/actions/actions.html',
        params: {
          line: null,
          col: null,
          q: null
        },
        resolve: {
          tableName: function ($stateParams, RulesService, DictionaryService, CONSTS) {
            DictionaryService.appName = RulesService.appName;
            RulesService.tableId = 4;
            DictionaryService.tableName = CONSTS.backandUserObject;
            return DictionaryService.tableName;
          }
        }
      })
  }

})();
