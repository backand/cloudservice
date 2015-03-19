(function() {
  'use strict';

  angular.module('app')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('security.users', {
        url: '/users/:name',
        controller: 'SecurityUsers as users',
        templateUrl: 'views/security/user/users.html'
      })
      .state('security.templates', {
        url: '/templates/:name',
        controller: 'SecurityWorkspace as securityws',
        templateUrl: 'views/security/workspace/workspace.html'
      })
      .state('security.auth', {
        url: '/auth/:name',
        controller: 'SecurityAuth as auth',
        templateUrl: 'views/security/auth/auth.html',
        resolve: {
          tableName: function ($stateParams, AppState, RulesService, DictionaryService) {
            DictionaryService.appName = RulesService.appName = AppState.set($stateParams.name);
            RulesService.tableId = 4;
            DictionaryService.tableName = 'v_durados_user';
            return DictionaryService.tableName;
          }
        }
      })
  }

})();
