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
      .state('security.templates', {
        url: '/templates',
        controller: 'SecurityWorkspace as securityws',
        templateUrl: 'views/security/workspace/workspace.html'
      })
      .state('security.auth', {
        url: '/auth',
        controller: 'SecurityAuth as auth',
        templateUrl: 'views/security/auth/auth.html',
        resolve: {
          tableName: function ($stateParams, RulesService, DictionaryService) {
            DictionaryService.appName = RulesService.appName;
            RulesService.tableId = 4;
            DictionaryService.tableName = 'v_durados_user';
            return DictionaryService.tableName;
          }
        }
      })
  }

})();
