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
      CronJobsController]);

  function CronJobsController(CronService, $state, $scope, DbQueriesService, RulesService, AppsService) {

    var self = this;

    function init() {
      self.appName = AppsService.currentApp.Name;
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

    init();

    function fetchActions() {
      RulesService.get().then(function (response) {
        var a = response.data;
      });
    }

    function fetchQueries() {
      DbQueriesService.getQueries(self.appName).then(function (response) {
        if (!self.queries) {
          self.queries = response;
        }
      });
    }
  }
})();
