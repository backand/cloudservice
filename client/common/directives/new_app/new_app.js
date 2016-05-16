(function () {
  'use strict';

  angular.module('common.directives')
    .directive('newApp', function () {
      return {
        restrict: 'EA',
        scope: {
          appName: '=',
          appTitle: '=',
          onAppAdded: '&'
        },
        templateUrl: 'common/directives/new_app/new_app.html',
        controller: NewAppController,
        controllerAs: 'newApp',
        bindToController: true
      };
    }
  );

  NewAppController.$inject = ['AppsService', 'DatabaseService', 'AnalyticsService', 'ModelService', 'NotificationService', '$state'];

  function NewAppController(AppsService, DatabaseService, AnalyticsService, ModelService, NotificationService, $state) {
    var self = this;

    self.namePattern = /^\w+$/;

    self.addApp = function () {
      self.loading = true;
      self.chosenAppName = angular.lowercase(self.chosenAppName);
      if (self.chosenAppTitle === '')
        self.chosenAppTitle = self.chosenAppName;
      self.appName = self.chosenAppName;

      NotificationService.add('info', 'Creating new app...');

      AppsService.add(self.chosenAppName, self.chosenAppTitle)
        .then(function (data) {
          createDB(self.chosenAppName);
        },
        function (err) {
          self.loading = false;
        });
    };

    function createDB(appName) {

      AnalyticsService.track('CreatedApp', {appName: appName});

      //create app with default schema
      var product = 10; //New MySQL

      DatabaseService.createDB(appName, product, '', ModelService.defaultSchema())
        .success(function (data) {
          self.onAppAdded();
          AnalyticsService.track('CreatedNewDB', {schema: ModelService.defaultSchema()});
          AnalyticsService.track('create app', {app: appName});
          $state.go('docs.kickstart', {appName: appName, newApp: true});
        })
        .error(function () {
          self.loading = false;
        });
    }
  }

}());



