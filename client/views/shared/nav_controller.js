(function () {
  'use strict';
  angular.module('controllers')
    .controller('NavCtrl', ['$scope', '$state','$rootScope', 'AppsService', '$log', 'TablesService', 'DbQueriesService', '$stateParams', 'AnalyticsService', 'CronService', '$localStorage','RulesService', 'usSpinnerService', NavCtrl]);

  function NavCtrl($scope, $state,$rootScope, AppsService, $log, TablesService, DbQueriesService, $stateParams, AnalyticsService, CronService, $localStorage, RulesService, usSpinnerService) {
    var self = this;
    self.isTablesClicked = false;
    self.apps = AppsService.apps;
    self.app = AppsService.currentApp;
    self.backandstorage = $localStorage.backand[self.app.Name];
    self.currentAppName = AppsService.currentApp.Name;
    self.currentState = $state.current.name;
    self.secondAppNavChoice = '';
    if(self.backandstorage){
      self.isDatabase = (self.backandstorage.secondAppNavChoice === 'database');
      self.showSecondaryAppNav = self.backandstorage.showSecondaryAppNav;
      if(self.backandstorage.secondAppNavChoice === undefined){
        self.backandstorage.secondAppNavChoice = 'database';
      }
    }
    else{
      self.isDatabase = false;
    }
    self.columnsLayout = 'col-md-2';
    self.gettingStartedNav = 'side-bar';
    (function init() {
      clearTables();
      if(self.backandstorage !== undefined) {
        if (self.backandstorage.showSecondaryAppNav) {
          self.showSecondaryAppNav = self.backandstorage.showSecondaryAppNav;
        }
      }
      if(!$state.params.appName){
        self.gettingStartedNav = 'side-bar-modified';
      }
    }());
    self.goToApp = function () {
      usSpinnerService.spin('loading-app');
      $localStorage.backand[self.currentAppName].showSecondaryAppNav = true;
      $state.go('app', {appName: self.currentAppName}, {reload: true});
    };
    function clearTables() {
      self.tables = [];
      self.queries = [];
      self.functions = [];
    }
    self.showSecondarySideBar = function(state){
      if(self.backandstorage){
        self.backandstorage.showSecondaryAppNav = true;
        self.showSecondaryAppNav = true;
        self.backandstorage.secondAppNavChoice = state;
        self.secondAppNavChoice = state;
        self.columnsLayout = 'col-md-3';
        if(state === "database"){
          $rootScope.$broadcast('database-change');
        }
        else{
          $rootScope.$broadcast('database-undo');
        }
      }

    };
    $scope.$on('app-update', function(event, args){
        self.currentAppName = args.app;
    });
    self.isExampleApp = function () {
      return AppsService.isExampleApp(self.app);
    };
    self.showAppNav = function () {
      if (!$state.params.appName)
        return 'views/shared/nav.html';
      if (!self.app)
        return null;
      if (self.app.DatabaseStatus === 0 || self.app.DatabaseStatus === 2)
        return 'views/shared/nav_connect_db.html';
      return 'views/shared/main_nav.html';
    };
    self.chooseSecondNav = function(){
      switch(self.backandstorage.secondAppNavChoice){
        case 'database':
          return 'views/shared/db_nav.html';
        case 'functions':
          return 'views/shared/fnc_nav.html';
        case 'security':
          return 'views/shared/sec_nav.html';
        case 'admin':
          return 'views/shared/admin_nav.html';
        default:
          return 'views/shared/db_nav.html';
      }
    };

    self.toggleSecondaryAppNav = function(){
      self.showSecondaryAppNav = !self.showSecondaryAppNav;
    };
    $scope.$on('fetchTables', fetchTables);
    $scope.$on('appname:saved', fetchTables);
    $scope.$on('after:sync', fetchTables);

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
            fetchCronJobs();
            fetchFunctions();
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

    function fetchFunctions() {
      RulesService.appName = $state.params.appName;
      RulesService.getFunctions().then(
          function (data) {
            self.functions = data.data.data;
          },
          function (data) {
            $log.debug("Can't get functions", data);
          }
      );
    }

    function fetchCronJobs() {
      CronService.appName = self.appName;
      CronService.getAll().then(function (response) {
          self.cronJobs = response.data.data;
        },
        function (error) {
          $log.debug("Error fetching cron jobs", error);
        }
      )
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

    self.getCronStatus = function(active){
      if(active)
        return 'success';
      else
        return 'error';
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

      //track events
      if (state == "app.billing") {
        AnalyticsService.track('BillingLeftMenuBillingPortal', {appName: $state.params.appName});
      }
      //track events
      if (state == "app.billingupgrade") {
        AnalyticsService.track('BillingLeftMenuBillingUpgrade', {appName: $state.params.appName});
      }
      //track events
      if (state == "app.billingpayment") {
        AnalyticsService.track('BillingLeftMenuBillingPayment', {appName: $state.params.appName});
      }

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
    self.newJsFunction = function($event){
      goToState($event, 'functions.newjsfunctions');
    };
    self.newLambdaFunction = function($event){
      goToState($event, 'functions.newlambdafunctions');
    };
    self.showFunction = function ($event, func) {
      var params = {
        functionId: func.__metadata.id
      };
      goToState($event, 'functions.function', params);
    };

    self.showCronJob = function ($event, job) {
      var params = {
        jobId: job.__metadata.id
      };
      goToState($event, 'cronJobs.job', params);
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
        $state.go(state, params).then(function(){
          self.backandstorage.currentState = $state.current.name;
        });
      }
    }

  }
}());
