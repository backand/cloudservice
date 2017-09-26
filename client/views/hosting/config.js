(function () {
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
      });
    /**
     * storage routes
     */
    $stateProvider.state('hosting.storage', {
      url: '/storage',
      absolute: true,
      template: '<div ui-view></div>'
    }).state('hosting.storage.backand_storage', {
      url: '/backand-storage',
      views: {
        '': {
          controller: 'FilesTreeController as filesTree',
          templateUrl: 'views/hosting/files_tree/files_tree.html'
        }
      }
    }).state('hosting.storage.external_storage', {
      url: '/external-storage',
      views: {
        '': {
          template: '<external-storage data-app-keys="appKeys" data-type="storage"></external-storage>',
          controller: ['$scope', 'appKeys', function ($scope, appKeys) {
            $scope.appKeys = appKeys;
          }],
          resolve: {
            appKeys: ['$stateParams', 'AppsService', function ($stateParams, AppsService) {
              var appName = $stateParams.appName;
              return AppsService.appKeys(appName);
            }]
          },
        }
      }
    });
  }

})();
