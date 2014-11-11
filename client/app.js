(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

  function MainController(SessionService,$state) {
    this.getCurrentUser = function(){
      return SessionService.currentUser;
    }

    this.logout = function(){
      SessionService.ClearCredentials();
      $state.go('sign_in');
    }

  }

  function run($log) {
    $log.debug('App is running!');
  }

  angular.module('controllers', []);
  angular.module('services', []);

  angular.module('app', [
      'ui.router',
      'app.routes',
      'theme.directives',
      'common.services',
      'common.directives.custom_page',
      'common.filters.uppercase',
      'common.interceptors.http',
      'controllers',
      'templates',
      'services',
      'app.apps'
    ])
    .run(run)
    .controller('MainController', ["SessionService",'$state',MainController])
    .value('version', '1.0.1');
})();
