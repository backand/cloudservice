(function () {
  'use strict';

  angular.module('backand.apps')
    .controller('AppsIndexController', ['$scope', 'AppsService', 'appsList', '$state', 'NotificationService', '$interval',
      'usSpinnerService', 'LayoutService', 'AnalyticsService', 'SessionService',
      'DatabaseService', 'ModelService', '$stateParams', '$modal', '$localStorage', 'ParseService', 'LocalStorageService','$rootScope', AppsIndexController]);

  function AppsIndexController($scope, AppsService, appsList, $state, NotificationService, $interval,
                               usSpinnerService, LayoutService, AnalyticsService, SessionService,
                               DatabaseService, ModelService, $stateParams, $modal, $localStorage, ParseService, LocalStorageService, $rootScope) {

    var self = this;
    self.loading = false;
    var stop;
    self.app = AppsService.currentApp;
    (function () {
      self.apps = appsList.data;
      self.showNewApp = self.apps.length == 0;
      self.showJumbo = LayoutService.showJumbo();
      if(self.app){
        self.backandstorage = $localStorage.backand[self.app.Name];
      }
      if ($stateParams.deletedApp) {
        self.apps = _.reject(self.apps, {Name: $stateParams.deletedApp});
      }

      //create todos sample app
      var userId = SessionService.getUserId();
      if (userId !== 0) {
        var exampleAppName = 'todo' + userId;
        if (!_.find(self.apps, {Name: exampleAppName})) {
          AppsService.add(exampleAppName, 'My First App - Todo list example');
        }
      }

    }());
    self.currentState = $state.current.name;
    self.appType = 2;
    self.changeAppType = function (type) {
      switch (type){
        case 'serverless':
          self.appType = 1;
          break;
        case 'function':
          self.appType = 2;
          break;
        case 'security':
          self.appType = 3;
          break;
      }
    };
    $scope.$on('new-app-redirect', function(){
      self.showNewApp = true;
    });
    self.addApp = function () {
      self.loading = true;
      self.appName = angular.lowercase(self.appName);
      if (self.appTitle === '')
        self.appTitle = self.appName;

      NotificationService.add('info', 'Creating new app...');

      // Comment these out to retain storage between application creation efforts
      LocalStorageService.getLocalStorage().docLanguage = null;
      LocalStorageService.getLocalStorage().favoriteLanguage = null;

      AppsService.add(self.appName, self.appTitle)
        .then(function (data) {
          stopRefresh();
          createDB(self.appName, self.appType);
        },
        function (err) {
          self.loading = false;
          // the error message already shows
          //NotificationService.add('error', err);
        });
    };
    self.goToGettingStarted = function(state){
      $rootScope.$broadcast('getting-started');
      $state.go(state);
    };
    function createDB(appName, appType) {

      AnalyticsService.track('CreatedApp', {appName: appName});

      //create app with default schema
      var product = 10; //New MySQL

      DatabaseService.createDB(appName, product, '', ModelService.defaultSchema(), appType)
        .success(function (data) {

          AnalyticsService.track('CreatedNewDB', {schema: ModelService.defaultSchema()});
          AnalyticsService.track('create app', {app: appName});

          if(!$localStorage.backand){
            $localStorage.backand = {};
          }

          if (!$localStorage.backand[appName]) {
            $localStorage.backand[appName] = {};
            self.backandstorage = $localStorage.backand[appName];
          }
          $localStorage.backand[appName].showSecondaryAppNav = true;
          self.setAppType(appType,appName);
          $rootScope.$broadcast('app-update', {app: appName});

          switch (appType){
            case 1:
              $state.go('docs.platform_select_kickstart', {appName: appName, newApp: true});
              break;
            case 2:
              $state.go('functions.externalFunctions', {appName: appName}, {reload: true}).then(function(){
                self.backandstorage.currentState = $state.current.name;
                self.stateparam = $state.params;
              });
              break;
            case 3:
              $state.go('app', {appName: appName, newApp: true}, {reload: true});
              break;
          }

        })
        .error(function () {
          self.loading = false;
        });
    }
    self.searchApp = '';
    $scope.$watch('index.searchApp', function (){
        self.searchOptions =  _.filter(self.apps, function(optionOfApp) {
           if(optionOfApp.Name.includes(self.searchApp)){
            return optionOfApp.Name;
          }
        });
    });

    self.setAppType = function (type, appName) {
      if(!$localStorage.backand[appName]){
        $localStorage.backand[appName] = {};
      }
      switch (type){
        case 1:
          $localStorage.backand[appName].secondAppNavChoice = 'database';
          break;
        case 2:
          $localStorage.backand[appName].secondAppNavChoice  = 'functions';
          break;
        case 3:
          $localStorage.backand[appName].secondAppNavChoice  = 'security';
          break;
      }
    };

    /**
     *
     * @param appName
     */
    self.appManage = function (app) {

      self.appSpinner = [];
      self.appSpinner[app.Name] = true;
      var spinnerName = 'loading-manage-'+ app.Name+'';
      usSpinnerService.spin(spinnerName);

      if(!$localStorage.backand){
        $localStorage.backand = {};
      }

      if (!$localStorage.backand[app.Name]) {
        $localStorage.backand[app.Name] = {};
        self.backandstorage = $localStorage.backand[app.Name];
      }

      if (!$localStorage.backand[app.Name].isParseMigrationReady) {
        ParseService.get(app.Name).then(function (data) {
          if (data.data.status == 0 || data.data.status == 1) {
            $localStorage.backand[app.Name].isParseMigrationReady = false;
          } else if (data.data.status == 2 || data.data.status == null) {
            $localStorage.backand[app.Name].isParseMigrationReady = true;
          }
          if (!$localStorage.backand[app.Name].isParseMigrationReady) {
            $modal.open({
              templateUrl: 'views/shared/parse_migration_success.html',
              controller: 'ParseSuccessController as parseSuccess'
            });

            self.appSpinner[app.Name] = false;
          } else {
            manageAppDirect(app);
          }
        });
      } else {
        manageAppDirect(app);
      }
    };

    function manageAppDirect(app) {
      if (app.DatabaseStatus !== 0) {
        if(app.PaymentLocked || app.PaymentStatus === 1){
          $modal.open({
            templateUrl: 'views/apps/billing_portal.html',
            controller: 'BillingPortalController as vm'
          });
          $modal.appName = app.Name;
          self.appSpinner[app.Name] = false;
        } else {
          if(!self.backandstorage){
            self.backandstorage = $localStorage.backand[app.Name]
          }

          $localStorage.backand[app.Name].showSecondaryAppNav = true;
          self.setAppType(app.ProductType, app.Name);

          if($localStorage.backand[app.Name].currentState !== 'apps.index') {
            var currentstate = $localStorage.backand[app.Name].currentState;
            if(isLauncher()){
              currentstate = "functions.externalFunctions";
            }
            $state.go('app', {appName: app.Name}, {reload: true}).then(function(){
              switch (currentstate){
                case "functions.function":
                  $state.go(currentstate, {functionId: $localStorage.backand[app.Name].Id});
                  break;
                case "cronJobs.job":
                  $state.go(currentstate, {jobId: $localStorage.backand[app.Name].Id});
                  break;
                case "dbQueries.query":
                  $state.go(currentstate, {queryId: $localStorage.backand[app.Name].Id});
                  break;
                case "object_fields":
                  $state.go(currentstate, {tableId: $localStorage.backand[app.Name].Id});
                  break;
                default:
                currentstate ? $state.go(currentstate) :  $state.go('app.index');
                  break;
              }
            });
          }
          else {
            var currentstate = "app";
            if(isLauncher()){
              currentstate = "functions.externalFunctions";
            }
            $state.go(currentstate, {appName: app.Name}, {reload: true});
          }
        }
      }
      else if (AppsService.isExampleApp(app)) {
        $state.go('database.example', {appName: app.Name});
      } else {
        createDB(app.Name);
      }
    }

    /**
     *
     * @param appName
     */
    self.appSettings = function (appName) {
      $state.go('app.edit', {appName: appName});
    };

    self.appBilling = function (appName, payment, appType) {
      AnalyticsService.track('BillingUpgradePlanInAppsPage', {appName: appName});

      //Check if the app is locked or suspended
      if(!payment) {
        $localStorage.backand[app.Name].showSecondaryAppNav = true;
        self.setAppType(appType, appName);
        $state.go('app.billingupgrade', {appName: appName});
      } else {
        $modal.open({
          templateUrl: 'views/apps/billing_portal.html',
          controller: 'BillingPortalController as vm'
        });
        $modal.appName = appName;
      }
    };
    self.goToLink = function (app) {
      $state.go(self.getGoToLink(app).state, {appName: app.Name});
    };

    self.getGoToLink = function (app) {
      if (AppsService.isExampleApp(app))
        return {
          state: 'playground.todo',
          linkTitle: 'Todo Example page'
        };
      else {
        return {
          state: 'playground.show',
          linkTitle: 'REST API Playground'
        }
      }
    };

    self.goToLocation = function (href) {
      window.open(href, '_blank');
    };

    self.getAppManageTitle = function (app) {
      if (app.DatabaseStatus === 2)
        return 'Creating App ...';
      if (app.DatabaseStatus === 1)
        return 'Manage App';
      if (AppsService.isExampleApp(app))
        return 'Create Example App';
      return 'Create App';
    };

    self.namePattern = /^\w+$/;

    self.getRibboninfo = function (app) {
      return convertStateNumber(app);
    };

    function convertStateNumber(app) {
      var ribbonInfo;
      switch (app.DatabaseStatus) {
        case 0:
          ribbonInfo = {class: "ui-ribbon-warning", text: 'PENDING'};
          break;
        case 1:
          ribbonInfo = {class: 'ui-ribbon-success', text: 'CONNECTED'};
          break;
        case 2:
          ribbonInfo = {class: "ui-ribbon-info", text: 'CREATE'};
          break;
        default:
          ribbonInfo = {class: 'ui-ribbon-danger', text: 'ERROR'};
          break;
      }
      if (self.exampleApp(app))
        ribbonInfo.text = 'Example';
      return ribbonInfo;
    }

    self.exampleApp = function (app) {
      return AppsService.isExampleApp(app);
    };

    stop = $interval(function () {
      AppsService.all()
        .then(function (apps) {
          self.apps = apps.data;
        },
        function (error) {
          stopRefresh();
        });
    }, 10000);

    function stopRefresh() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    }

    $scope.$on('$destroy', function () {
      // Make sure that the interval is destroyed too
      stopRefresh();
    });

    self.closeJumbo = function () {
      LayoutService.closeJumbo();
      self.showJumbo = false;
    };

    self.openJumbo = function () {
      LayoutService.openJumbo();
      self.showJumbo = true;
    };

        /**
     * @ngdoc function
     * @name isLauncher
     * @description checks if launcher = 1 param exists in URL
     *
     * @returns {boolean}
     */
    function isLauncher() {
      var launcher = $state.params.launcher;
      return (typeof launcher !== 'undefined') && (launcher == 1);
    }

  }
}());
