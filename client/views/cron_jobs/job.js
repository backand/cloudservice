(function () {
  'use strict';
  angular.module('backand.cronJobs')
    .controller('CronJobsController', [
      'CronService',
      '$state',
      '$scope',
      'DbQueriesService',
      'RulesService',
      'AppsService',
      'NotificationService',
      CronJobsController]);

  function CronJobsController(CronService, $state, $scope, DbQueriesService, RulesService, AppsService, NotificationService) {

    var self = this;

    function init() {
      self.appName = AppsService.currentApp.Name;
      RulesService.appName = self.appName;
      self.types = ['Action', 'Query', 'External'];
      self.namePattern = /^\w+$/;
      self.new = $state.current.name === "cronJobs.new";
      self.editMode = self.new || $state.current.name === "cronJobs.newSavedJob";
      self.job = {};

      $scope.$watch(function () {
        return self.job.cronType;
      }, function (newValue, oldValue) {
        if (newValue == 'Action') {
          fetchActions();
        } else if (newValue == 'Query') {
          fetchQueries();
        }
      });
    }

    self.saveJob = function () {
      self.loading = true;
      CronService.post(self.job).then(function (response) {
        self.loading = false;
        console.log(response);
        NotificationService.add('success', 'Cron job added successfully');
      },
      function (error) {
        self.loading = false;
      });
    };

    function fetchActions() {
      if (!self.actions) {
        RulesService.get().then(function (response) {
          self.actions = _.filter(response.data.data, function (action) {
            return action.dataAction == 'OnDemand';
          });
        });
      }
    }

    function fetchQueries() {
      if (!self.queries) {
        DbQueriesService.getQueries(self.appName).then(function (response) {
          self.queries = response;
        });
      }
    }

    init();
  }
})();
