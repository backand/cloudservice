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
        templateUrl: 'views/docs/get-started-open.html'
      })
      .state('docs.getting-started-open', {
        parent: 'apps',
        url: 'start',
        templateUrl: 'views/docs/get-started-open.html',
        controller: 'Docs as docs'
      })
      .state('docs.kickstart', {
        parent: 'app',
        url: '/docs/kickstart',
        templateUrl: 'views/docs/kickstart.html'
      })
      .state('docs.kickstart-open', {
        parent: 'apps',
        url: 'kickstart',
        templateUrl: 'views/docs/kickstart-open.html'
      })
      .state('docs.api-desc', {
        parent: 'app',
        url: 'api',
        templateUrl: 'views/docs/api-desc.html'
      })
      .state('docs.api-desc-open', {
        parent: 'apps',
        url: 'api',
        templateUrl: 'views/docs/api-desc.html'
      })
  }

})();
