(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

  function MainCtrl($log) {
  }

  function run($log) {
    $log.debug('App is running!');
  }

  angular.module('controllers', []);

  angular.module('app', [
      'ui.router',
      'app.routes',
      'theme.directives',
      'common.services.data',
      'common.directives.custom_page',
      'common.filters.uppercase',
      'common.interceptors.http',
      'controllers',
      'templates'
    ])
    .run(run)
    .controller('MainCtrl', MainCtrl)
    .value('version', '1.0.1');
})();
