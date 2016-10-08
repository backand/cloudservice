(function() {
  'use strict';

  angular.module('backand')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('security.users', {
        url: '/users',
        controller: 'SecurityUsers as users',
        templateUrl: 'views/security/user/users.html'
      })
      .state('security.team', {
        url: '/team',
        controller: 'SecurityUsers as users',
        templateUrl: 'views/security/user/users.html'
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
