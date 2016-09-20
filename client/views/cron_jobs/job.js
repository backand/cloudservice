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
      'stringifyHttp',
      'TablesService',
      'usSpinnerService',
      CronJobsController]);

  function CronJobsController(CronService, $state, $scope, DbQueriesService, RulesService, AppsService, NotificationService, $stateParams, ConfirmationPopup, stringifyHttp,TablesService,usSpinnerService) {

    var self = this;

    function init() {
      self.appName = AppsService.currentApp.Name;
      RulesService.appName = self.appName;
      CronService.appName = self.appName;
      self.cronConfig = {
        allowMultiple: true
      };
      self.frequency = {
        base: 1
      }
      self.types = ['Action', 'Query', 'External'];
      //self.namePattern = /^\w+$/;
      self.new = $state.current.name === "cronJobs.new";
      self.editMode = self.new || $state.current.name === "cronJobs.newSavedJob";
      self.job = {};
      self.testHttp = stringifyHttp(CronService.getTestHttp($stateParams.jobId));
      self.testUrl = CronService.getTestUrl($stateParams.jobId);
      if (!self.new) {
        CronService.get($stateParams.jobId).then(function (response) {
          usSpinnerService.stop("loading");
          self.job = response.data;
          if ($stateParams.isTest) {
            self.test();
          }
        });
      }
      else{
        usSpinnerService.stop("loading");
      }

      //default values of the Job
      self.job.method = "GET";
      self.showAdvanced = false;

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

    self.saveJob = function (isTest) {
      self.loading = true;
      if ($stateParams.jobId) {
        updateJob(isTest);
      } else {
        createJob(isTest);
      }
    };

    self.deleteJob = function () {
      ConfirmationPopup.confirm('Are you sure you want to delete this cron job?')
        .then(function (result) {
          if (result) {
            self.loading = true;
            CronService.delete($stateParams.jobId).then(function (response) {
              self.loading = false;
              NotificationService.add('success', "Cron job deleted successfully");
              $state.go('cronJobs.new');
            });
          }
        });
    };

    self.editJob = function () {
      self.editMode = true;
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

    self.test = function () {
      CronService.test($stateParams.jobId).then(function (response) {
        self.testResult = {
          request: JSON.stringify(response.data.request, null, 2),
          response: JSON.stringify(response.data.response, null, 2)
        };
      }, function (error) {
        self.testError = error.data.Message;
      });
    };

    self.allowTest = function () {
      return self.job && self.job.__metadata && self.jobForm.$pristine;
    };

    function fetchActions() {
      if (!self.actions) {
        self.loadingActions = true;
        RulesService.get().then(function (response) {
          self.actions = _.filter(response.data.data, function (action) {
            var view = TablesService.getTableNameById(TablesService.tables,action.viewTable);
            if(view) {
              action.name = view.name + '.' + action.name;
            }
            return action.dataAction == 'OnDemand' && action.viewTable != 4;
          });
          self.loadingActions = false;
        });
      }
    }

    function errorHandler(error) {
      self.loading = false;
    }

    function createJob(isTest) {
      CronService.post(self.job).then(function (response) {
        self.loading = false;
        NotificationService.add('success', 'Cron job added successfully');
        var params = {jobId: response.data.__metadata.id};
        if(isTest) {
          params.isTest = true;
        }
        $state.go('cronJobs.job', params)
      }, errorHandler);
    }

    function updateJob(isTest) {
      CronService.update($stateParams.jobId, self.job).then(function (response) {
        self.loading = false;
        NotificationService.add('success', 'Cron job updated successfully');
        if (isTest) {
          self.test();
        }
      }, errorHandler);
      self.jobForm.$setPristine();
    }

    function fetchQueries() {
      if (!self.queries) {
        self.loadingQueries = true;
        DbQueriesService.getQueries(self.appName).then(function (response) {
          self.queries = response;
          self.loadingQueries = false;
        });
      }
    }

    init();
  }
})();
