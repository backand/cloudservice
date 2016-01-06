
(function  () {

  'use strict';
  angular.module('backand.apps')
    .controller('AppShowController',['$scope', 'AppsService', '$sce', '$state', 'ColumnsService', 'TablesService', AppShowController]);

  function AppShowController($scope, AppsService, $sce, $state, ColumnsService, TablesService){
    var self = this;

    var app = AppsService.currentApp;
    self.currentApp = app;
    self.appName = app.Name;
    self.objects = {};
    $scope.appName = self.appName;

    $scope.$root.$broadcast('fetchTables');

    //not connected to database :
    if (app.DatabaseStatus !== 1) {
      return $state.go('database.edit', {name: self.appName})
    }

    self.statisticsArray = app.stat;

    self.logLimit = 7;
    self.appTitle = app.Title;
    self.connectionStatus = '';
    self.alertMsg = '';

    init();

    self.goToLocation = function(href) {
        window.open(href, '_blank');
    };

    AppsService.appDbStat($state.params.appName)
      .then(function(data){
        if (data.data.tableCount == 0) {
          var msg = 'Your app has no objects! go to <a href="#/app/' + $state.params.appName + '/objects/model' +
            '">Backand Model</a> to populate the app or use any DB admin tool like Workbench or phpMyAdmin';

          self.alertMsg = $sce.trustAsHtml(msg);
          AppsService.setAlert($state.params.appName, msg)
        }
      });


    self.setAlertStatus = function() {
      AppsService.setAlert(self.appName, '');
      self.alertMsg = '';
    };

    $scope.$on('$destroy', function() {

    });


    self.updateAppName = function() {
      AppsService.update(self.appName, self.appTitle)
    };

    self.goToObjectPage = function (objectName, objectId, state) {
      $state.go(state, {
        tableName: objectName,
        tableId: objectId
      });
    };

    function init() {
      TablesService.get(self.appName).then(function (data) {
        data.forEach(function (object) {
          // Currently using placeholders until we have Dbstat service
          self.objects[object.name] = {};
          self.objects[object.name].isAuthSecurityOverridden = true;
          self.objects[object.name].records = 5324;
          self.objects[object.name].actions = 12;
          self.objects[object.name].isDataSecurityEnabled = false;
          self.objects[object.name].relatedObjects = ['Users', 'Files'];
          self.objects[object.name].id = object.__metadata.id;
        });
        self.objects.items.records=33333333333;
      });


    }
  }
}());
