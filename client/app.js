(function () {
  'use strict';

  function MainController(SessionService, $state, $location) {
    this.getCurrentUser = function () {
      return SessionService.currentUser;
    };

    this.logout = function () {
      SessionService.ClearCredentials();
      $location.path("/sign_in")
    }
  }

  function run($log, editableOptions) {
    $log.debug('App is running!');
    editableOptions.theme = 'bs3';
  }

  angular.module('controllers', []);
  angular.module('services', []);

  angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ui.grid',
    'ui.tree',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'angled-windows',
    'xeditable',
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
    .controller('MainController', ["SessionService", '$state', '$location', MainController])
    .value('version', '1.0.1');

  angular.element(document).ready(function () {
    angular.bootstrap(document, ['app']);
  });


})();
