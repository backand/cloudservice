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
        appsList: ['AppsService',function(AppsService){
          return AppsService.getAllApps();
        }]
      }
    })
    .state('apps.show', {
      url: '/:name',
      controller: 'AppsShowController as show',
      templateUrl: 'views/apps/show.tpl.html',
      resolve:{
        appItem: ['AppsService','$stateParams',function(AppsService,stateParams){
          return AppsService.getSingleApp(stateParams.name);
        }]
      }
    })
    .state('apps.data', {
      url: '/:name/data-base',
      controller: 'AppsDataController as data',
      templateUrl: 'views/apps/data_base.html'
    })
    .state('apps.data.source', {
      url: '',
      //controller: 'AppsDataController as data',
      templateUrl: 'views/apps/data_base_source.html'
    })
}

angular.module('app.apps').controller('AppsShowController',
  ['appItem', function(appItem) {
    this.appUploadState = 'bg-danger';
    this.appConnectedState = "bg-success";
    this.appWarnState ='bg-warning';


    var appData = appItem.data;
    this.appName = appData.Name;
  }
]);

angular.module('app.apps').controller('AppsIndexController',
  [ '$scope', 'AppsService','appsList',
  function($scope, AppsService,appsList) {
    $scope.apps = appsList.data.data;
}]);

angular.module('app.apps').controller('AppsDataController',
  [ '$scope', 'AppsService','$stateParams',
    function($scope, AppsService,$stateParams) {
      //this.connectDB = AppsService.connect2DB($stateParams.name);

      this.appName = $stateParams.name;
    }]);

