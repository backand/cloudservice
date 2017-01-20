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
      .state('docs.get-started-ng2', {
        parent: 'app',
        url: '/docs/start2',
        controller: 'Docs as docs',
        templateUrl: 'views/docs/get_started_ng2.html'
      })
      .state('docs.getting-started-open', {
        parent: 'apps',
        url: 'start',
        templateUrl: 'views/docs/get_started_open.html',
        controller: 'Docs as docs'
      })
      .state('docs.getting-started-ng2', {
        parent: 'apps',
        url: 'start2',
        templateUrl: 'views/docs/get_started_ng2.html',
        controller: 'Docs as docs'
      })
      .state('docs.kickstart', {
        parent: 'app',
        url: '/docs/kickstart',
        templateUrl: 'views/docs/kickstart.html',
        controller: 'Docs as docs',
        params: {
          newApp: false
        }
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
      .state('docs.realtime-open', {
        parent: 'apps',
        url: 'realtime',
        templateUrl: 'views/docs/realtime_database.html',
        controller: 'Docs as docs'
      })
      .state('docs.hosting', {
        parent: 'app',
        url: '/hosting/config',
        templateUrl: 'views/docs/hosting.html',
        controller: 'Docs as docs'
      })
      .state('docs.kickstart_ng1',{
        parent: 'app',
        url: '/docs/kickstart?ng1',
        templateUrl: 'views/docs/kickstarts/ng1.html',
        controller: 'Docs as docs'
      })
      .state('docs.kickstart_ng2',{
        parent: 'app',
        url: '/docs/kickstart?ng2',
        templateUrl: 'views/docs/kickstarts/ng2.html',
        controller: 'Docs as docs'
      })
      .state('docs.kickstart_ionic1',{
        parent: 'app',
        url: '/docs/kickstart?ionic1',
        templateUrl: 'views/docs/kickstarts/ionic1.html',
        controller: 'Docs as docs'
      })
      .state('docs.kickstart_ionic2',{
        parent: 'app',
        url: '/docs/kickstart?ionic2',
        templateUrl: 'views/docs/kickstarts/ionic2.html',
        controller: 'Docs as docs'
      })
  }

})();
