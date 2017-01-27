(function () {

  'use strict';

  angular.module('backand.apps.create', [])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('docs.platform_select', {
        url: '/platform_select',
        controller: 'PlatformSelectController as platform',
        templateUrl: 'views/apps/app_creation/platform_select.html'
      })
  }
})();
