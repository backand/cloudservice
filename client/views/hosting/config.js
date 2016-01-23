(function() {
  'use strict';

  angular.module('backand')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('hosting.hosting_tree', {
        url: '/hosting_tree',
        controller: 'HostingTreeController as hostingTree',
        templateUrl: 'views/hosting/hosting_tree/hosting_tree.html'
      })
      .state('hosting.files_tree', {
        url: '/files_tree',
        controller: 'FilesTreeController as filesTree',
        templateUrl: 'views/hosting/files_tree/files_tree.html'
      })
  }

})();
