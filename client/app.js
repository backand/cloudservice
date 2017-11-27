(function () {
  'use strict';

  /**
   * optimizations (nir)
   * @param $compileProvider
   * @param $httpProvider
   */
  function appConfig($compileProvider, $httpProvider) {
    $compileProvider.debugInfoEnabled(false);
    $httpProvider.useApplyAsync(true);
  }

  function run($log, editableOptions, $localStorage, assets_path, $rootScope) {
    $log.debug('App is running!');
    editableOptions.theme = 'bs3';
    $localStorage.backand = $localStorage.backand || {};
    $rootScope.assets_path = assets_path;
  }

  angular.module('controllers', ['perfect_scrollbar']);
  angular.module('services', []);

  angular.module('backand', [
    'ui.router',
    'ui.bootstrap',
    'ui.grid',
    'ui.tree',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.ace',
    'ngClipboard',
    'backand.routes',
    'backand.consts',
    'angularSpinner',
    'ngAnimate',
    'toaster',
    'xeditable',
    'angular-ladda',
    'angularMoment',
    'ui.router.tabs',
    'common.modals',
    'common.directives',
    'theme.directives',
    'common.services',
    'common.data_models',
    'common.filters.uppercase',
    'common.filters.newTerminology',
    'common.interceptors.http',
    'common.constants',
    'controllers',
    'templates',
    'services',
    'backand.apps',
    'backand.database',
    'backand.backoffice',
    'backand.playground',
    'backand.docs',
    'backand.dbQueries',
    'backand.functions',
    'backand.cronJobs',
    'backand.externalFunctions',
    'ngMessages',
    'pascalprecht.translate',
    'angled-windows.directives',
    'ngStorage',
    'angulartics',
    'angulartics.segment.io',
    'flowChart',
    'ngFileUpload',
    'angular-cron-jobs',
    'ngTagsInput'
  ])
    .config(['ngClipProvider', function (ngClipProvider) {
      ngClipProvider.setPath("vendor/zeroclipboard/dist/ZeroClipboard.swf");
    }])
    .run(['$log', 'editableOptions', '$localStorage', 'assets_path', '$rootScope', run])
    .value('version', '1.9.4');


  angular.element(document).ready(function () {
    angular.bootstrap(document, ['backand']);
  });


})();
