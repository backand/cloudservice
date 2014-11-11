'use strict';

angular.module('app.apps', ['services'])
  .config(config);

function config($stateProvider) {
  $stateProvider
    .state('apps.index', {
      url: '',
      controller: 'AppsIndexController',
      templateUrl: 'views/apps/index.tpl.html',
      resolve:{
        appsList: function(AppsService){
          return AppsService.getAllApps();
        }
      }
    })
    .state('apps.show', {
    url: '/:id',
    controller: 'AppsShowController',
    templateUrl: 'views/apps/show.tpl.html'
    })
}

angular.module('app.apps').controller('AppsShowController',
  ['$scope', '$stateParams', 'AppsService',
  function($scope, $stateParams, AppsService) {
    this.appUploadState = 'bg-danger';
    this.appConnectedState = "bg-success";
    this.appWarnState ='bg-warning';
  }
]);

angular.module('app.apps').controller('AppsIndexController',
  [ '$scope', 'AppsService','appsList',
  function($scope, AppsService,appsList) {
    $scope.apps = appsList.data;
}]);
