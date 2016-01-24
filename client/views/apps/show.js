(function () {

(function  () {

  'use strict';
  angular.module('backand.apps')
    .controller('AppShowController', ['$scope', 'AppsService', '$sce', '$state', 'TablesService', 'RulesService', 'FieldsService', 'DbDataModel', 'usSpinnerService', AppShowController]);

  function AppShowController($scope, AppsService, $sce, $state, TablesService, RulesService, FieldsService, DbDataModel, usSpinnerService) {
    var self = this;

    var app = AppsService.currentApp;
    self.currentApp = app;
    self.appName = app.Name;
    self.currentModel = DbDataModel.currentModel;
    self.newModel = DbDataModel.newModel;
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

    self.refresh = function () {
      usSpinnerService.spin('loading');
      AppsService.getApp(self.appName).then(function (data) {
        init();
      });
    };

    function init() {
      DbDataModel.get(self.appName).finally(function () {
        TablesService.get(self.appName).then(function (objectData) {
          RulesService.appName = self.appName;
          RulesService.get().then(function (rules) {
            objectData.forEach(function (object) {
              self.objects[object.name] = {};
              self.objects[object.name].relatedObjects = FieldsService.getRelatedFieldsForObject(object.name);
              self.objects[object.name].records = self.currentApp.stat.totalRows[object.name];
              self.objects[object.name].isAuthSecurityOverridden = self.currentApp.stat.authorizationSecurity[object.name];
              self.objects[object.name].isDataSecurityEnabled = self.currentApp.stat.dataSecurity[object.name];
              self.objects[object.name].id = object.__metadata.id;
              self.objects[object.name].actions = _.where(rules.data.data, {viewTable: object.__metadata.id}).length;
            });
            usSpinnerService.stop('loading');
          });
        });
      });


    }
  }
}());
