(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

  function MainController(SessionService,$state,$location) {
    this.getCurrentUser = function(){
      return SessionService.currentUser;
    };

    this.logout = function(){
      SessionService.ClearCredentials();
      $location.path("/sign_in")
    }

  }

  function run($log) {
    $log.debug('App is running!');
  }

  angular.module('controllers', []);
  angular.module('services', []);

  angular.module('app', [
      'ui.router',
      'ui.bootstrap',
      'ui.grid',
      'ui.grid.edit',
      'ui.grid.rowEdit',
      'ui.grid.cellNav',
      'app.routes',
      'app.consts',
      'angularSpinner',
      'ngAnimate',
      'toaster',
      'xeditable',
      'angular-ladda',
      'angularMoment',
      'common.directives',
      'theme.directives',
      'common.services',
      'common.directives.custom_page',
      'common.filters.uppercase',
      'common.interceptors.http',
      'controllers',
      'templates',
      'services',
      'app.apps',
      'app.database',
      'app.backoffice',
      'app.playground',
    ])
    .run(run)
    .controller('MainController', ["SessionService",'$state','$location',MainController])
    .value('version', '1.0.1');
})();
