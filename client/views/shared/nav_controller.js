(function () {
  'use strict';
  angular.module('controllers')
    .controller('NavCtrl', ['$scope', '$state', 'AppsService', '$log', 'TablesService', 'DbQueriesService', '$stateParams', NavCtrl]);

  function NavCtrl($scope, $state, AppsService, $log, TablesService, DbQueriesService, $stateParams) {
    var self = this;
    self.isTablesClicked = false;

    (function init() {
      self.app = AppsService.currentApp;
      clearTables();
    }());

    function clearTables() {
      self.tables = [];
      self.queries = [];
    }

    self.isExampleApp = function () {
      return AppsService.isExampleApp(self.app);
    };

    self.showAppNav = function () {
      if (!$state.params.appName)
        return 'views/shared/nav.html';
      if (!self.app)
        return null;
      if (self.app.DatabaseStatus == 0 || self.app.DatabaseStatus == 2)
        return 'views/shared/nav_connect_db.html';
      return 'views/shared/nav_app.html';
    };


    $scope.$on('fetchTables', fetchTables);
    $scope.$on('appname:saved', fetchTables);

    function fetchTables() {
      clearTables();
      loadTables();
    }

    function loadTables() {
      self.appName = $state.params.appName;
      if (self.appName == undefined)
        return;
      TablesService.get(self.appName).then(
        function (data) {
          self.tables = data;
          if (self.appName) {
            if (self.tables.length == 0) { //only check the database if there are no tables
              AppsService.appDbStat(self.appName).then(successDbStats);
            }
            else {
              self.dbEmpty = false;
            }

            fetchDbQueries();
          }
        },
        function (data) {
          $log.debug("TablesService failure", data);
        }
      );
    }

    function successDbStats(data) {
      if (data.data) {
        self.dbEmpty = data.data.tableCount == 0;
      }
    }

    function fetchDbQueries() {
      DbQueriesService.getQueries($state.params.appName).then(
        function (data) {
          self.queries = data;
        },
        function (data) {
          $log.debug("DbQueriesService failure", data);
        }
      );
    }

    $scope.$on('$stateChangeSuccess', function () {
      self.state = $state.current.name;
      self.appName = $state.params.appName;
      loadApp();
    });

    $scope.$on('AppDbReady', loadApp);

    function loadApp() {
      if (typeof self.appName === 'undefined') {
        return;
      }
      AppsService.getApp(self.appName)
        .then(successGetCurrentApp);
    }

    function successGetCurrentApp(data) {
      self.app = data;
      self.DatabaseStatus = self.app.DatabaseStatus;
      if (self.DatabaseStatus == 0)
        self.tables = [];
      else if (self.DatabaseStatus == 1)
        loadTables();
    }

    self.isTablesActive = function () {
      return $state.includes('tables.columns') || $state.current.name == 'erd_model' || $state.current.name == 'json_model';
    };

    self.getObjectMenuStyle = function () {
      if ($stateParams.newApp || self.isTablesActive()) {
        return "block";
      }
      return "none";
    };

    self.getDBStatus = function () {
      if (_.isEmpty(self.app)) {
        return 'unknown';
      }

      switch (parseInt(self.app.DatabaseStatus)) {
        case 0:
        case 2:
          return 'warning';
        case 1:
          return 'success';
        default:
          return 'error';
      }
    };

    self.goTo = function ($event, state) {

      if (self.app.DatabaseStatus === 1) {
        goToState($event, state);
      }
    };

    self.goToAlways = function ($event, state) {
      goToState($event, state);
    };

    self.goToLocation = function (href) {
      if (self.app.DatabaseStatus === 1) {
        window.open(href, '_blank');
      }
    };

    self.showTable = function ($event, table) {
      var path = 'object_fields';
      var params = {
        tableName: table.name,
        tableId: table.__metadata.id
      };
      goToState($event, path, params);
    };

    self.showDbQuery = function ($event, query) {
      var params = {
        queryId: query.__metadata.id
      };
      goToState($event, 'dbQueries.query', params);
    };

    self.newDbQuery = function ($event) {
      goToState($event, 'dbQueries.newQuery');
    };

    self.newObject = function () {
      var params = {isNewObject: true};
      $state.go('erd_model', params);
    };

    // Used to support opening links in new tab
    function goToState($event, state, params) {
      if ($event.which === 2 || ($event.which === 1 && ($event.metaKey || $event.ctrlKey))) {
        var url = $state.href(state, params, {absolute: true});
        window.open(url, '_blank');
      } else {
        $state.go(state, params);
      }
    }

  }
}());
