(function() {

  'use strict';

  angular.module('backand.docs', [])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('docs', {
        url: 'docs',
        abstract: true,
        template: '<ui-view autoscroll="true"/>'
      })
      .state('docs.get-started', {
        parent: 'app',
        url: '/docs/start',
        controller: 'Docs as docs',
        templateUrl: 'views/docs/get_started_open.html'
      })
      .state('docs.getting-started-open', {
        parent: 'apps',
        url: 'start',
        templateUrl: 'views/docs/get_started_open.html',
        controller: 'Docs as docs'
      })
      .state('docs.kickstart', {
        parent: 'app',
        url: '/docs/kickstart',
        templateUrl: 'views/docs/kickstart.html',
        controller: 'Docs as docs'
      })
      .state('docs.kickstart-open', {
        parent: 'apps',
        url: 'kickstart',
        templateUrl: 'views/docs/kickstart.html',
        controller: 'Docs as docs'
      })
      .state('docs.api-desc', {
        parent: 'app',
        url: '/docs/api',
        templateUrl: 'views/docs/api_desc.html',
        controller: 'Desc as desc'
      })
      .state('docs.api-desc-open', {
        parent: 'apps',
        url: 'api',
        templateUrl: 'views/docs/api_desc.html',
        controller: 'Desc as desc'
      })
      .state('docs.mobile-open', {
        parent: 'apps',
        url: 'mobile',
        templateUrl: 'views/docs/ionic_starter.html',
        controller: 'Docs as docs'
      })
      .state('docs.mobile', {
        parent: 'app',
        url: '/docs/mobile',
        templateUrl: 'views/docs/ionic_starter.html',
        controller: 'Docs as docs'
      })
      .state('docs.realtime', {
        parent: 'app',
        url: '/docs/realtime',
        templateUrl: 'views/docs/realtime_database.html',
        controller: 'Docs as docs'
      })
      .state('docs.hosting', {
        parent: 'app',
        url: '/hosting/config',
        templateUrl: 'views/docs/hosting.html',
        controller: 'Docs as docs'
      })
  }

})();
