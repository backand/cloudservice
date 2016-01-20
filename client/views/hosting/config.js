(function() {
  'use strict';

  angular.module('backand')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('hosting.view', {
        url: '/view',
        controller: 'HostingViewController as hostingView',
        templateUrl: 'views/hosting/view/hosting_view.html'
      })
  }

})();
