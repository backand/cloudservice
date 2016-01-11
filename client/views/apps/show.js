(function () {

  'use strict';
  angular.module('backand.apps')
    .controller('AppShowController', ['$scope', 'AppsService', '$sce', '$state', 'ColumnsService', 'TablesService', 'RulesService', AppShowController]);

  function AppShowController($scope, AppsService, $sce, $state, ColumnsService, TablesService, RulesService) {
    var self = this;

    var app = AppsService.currentApp;
    self.currentApp = app;
    self.appName = app.Name;
    self.objects = {};
    self.showOldDashboard = false;
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

    self.goToLocation = function (href) {
      window.open(href, '_blank');
    };

    AppsService.appDbStat($state.params.appName)
      .then(function (data) {
        if (data.data.tableCount == 0) {
          var msg = 'Your app has no objects! go to <a href="#/app/' + $state.params.appName + '/objects/model' +
            '">Backand Model</a> to populate the app or use any DB admin tool like Workbench or phpMyAdmin';

          self.alertMsg = $sce.trustAsHtml(msg);
          AppsService.setAlert($state.params.appName, msg)
        }
      });


    self.setAlertStatus = function () {
      AppsService.setAlert(self.appName, '');
      self.alertMsg = '';
    };

    $scope.$on('$destroy', function () {

    });


    self.updateAppName = function () {
      AppsService.update(self.appName, self.appTitle)
    };

    self.goToObjectPage = function (objectName, objectId, state) {
      $state.go(state, {
        tableName: objectName,
        tableId: objectId
      });
    };

    self.goToPage = function (state) {
      $state.go(state);
    };

    function init() {
      TablesService.get(self.appName).then(function (data) {
        RulesService.appName = self.appName;

        data.forEach(function (object) {
          self.objects[object.name] = {};
          ColumnsService.tableName = object.name;
          ColumnsService.get().then(function (data) {
            self.objects[object.name].relatedObjects = extractRelatedObjectsForObject(data);
            self.objects[object.name].isAuthSecurityOverridden = data.permissions.overrideinheritable;
          });
          self.objects[object.name].records = self.currentApp.stat.totalRows[object.name];
          self.objects[object.name].id = object.__metadata.id;
          RulesService.tableId = self.objects[object.name].id;
          RulesService.get().then(function (data) {
            self.objects[object.name].actions = data.data.data.length;
          });

          // Placeholder
          self.objects[object.name].isDataSecurityEnabled = false;
        });
        var objectKey = _.keys(self.objects)[0];
        self.objects[objectKey].isDataSecurityEnabled = true;
      });


      function extractRelatedObjectsForObject(columnsData) {
        var relatedObjects = [];
        columnsData.fields.forEach(function (field) {
          if (field.relatedViewName != '') {
            relatedObjects.push(field.relatedViewName);
          }
        });
        return relatedObjects;
      }
    }
  }
}());
