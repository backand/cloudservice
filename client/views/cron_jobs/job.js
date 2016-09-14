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
      '$stateParams',
      'ConfirmationPopup',
      CronJobsController]);

  function CronJobsController(CronService, $state, $scope, DbQueriesService, RulesService, AppsService, NotificationService, $stateParams, ConfirmationPopup) {

    var self = this;

    function init() {
      self.appName = AppsService.currentApp.Name;
      RulesService.appName = self.appName;
      CronService.appName = self.appName;
      self.cronConfig = {
        allowMultiple: true
      };
      self.types = ['Action', 'Query', 'External'];
      self.namePattern = /^\w+$/;
      self.new = $state.current.name === "cronJobs.new";
      self.editMode = self.new || $state.current.name === "cronJobs.newSavedJob";
      self.job = {};
      if (!self.new) {
        CronService.get($stateParams.jobId).then(function (response) {
          self.job = response.data;
        });
      }

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
        NotificationService.add('success', 'Cron job added successfully');
      },
      function (error) {
        self.loading = false;
      });
    };

    self.cancel = function () {
      if (self.jobForm.name.$pristine)
        self.editMode = false;
      else {
        ConfirmationPopup.confirm('Changes will be lost. Are sure you want to cancel editing?')
          .then(function (result) {
            result ? init() : false;
          });
      }
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

    self.editJob = function () {
      self.editMode = true;
    };

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
