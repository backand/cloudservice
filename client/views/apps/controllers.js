'use strict';

angular.module('app.apps', ['services'])
  .config(config);

function config($stateProvider) {
  $stateProvider
    .state('apps.index', {
      url: '',
      controller: 'AppsIndexController',
      templateUrl: 'views/apps/index.tpl.html'
    })
    .state('apps.edit', {
      url: '/:id',
      controller: 'AppsEditController',
      templateUrl: 'views/apps/edit.tpl.html'
    });
}

angular.module('app.apps').controller('AppsEditController',
  ['$scope', '$stateParams', 'AppsService',
  function($scope, $stateParams, AppsService) {
    $scope.appId = $stateParams.id;
    $scope.app = AppsService.get($scope.appId);
  }
]);

angular.module('app.apps').controller('AppsIndexController',
  [ '$scope', 'AppsService',
  function($scope, AppsService) {
    $scope.apps = AppsService.all();
}]);
