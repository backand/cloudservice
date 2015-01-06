/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {

  function RulesController($modal, $scope, RulesService, NotificationService) {

    var self = this;

    /**
     * init an empty items array on scope
     * register an event listener.
     * init the open modal
     */
    (function init() {
      self.items = [];
      $scope.$on('tabs:rules', getRules);
      self.open = launchModal;
    }());

    /**
     * init and launch modal window and
     * pass it a scope
     */
    function launchModal() {

      var modalInstance = $modal.open({
        templateUrl: 'views/tables/rules/new_rule.html',
        backdrop: 'static',
        scope: $scope
      });

      var defaultRule = {
        "viewTable": RulesService.tableId,
        "additionalView": "",
        "databaseViewName": "",
        "useSqlParser": false
      };

      $scope.close = function (rule) {
        var data = angular.extend(defaultRule, rule);
        RulesService.post(data).then(getRules);
        modalInstance.close()
      };

      $scope.cancel = function () {
        modalInstance.dismiss()
      };

      $scope.modal = {
        title: 'Application Rule',
        okButtonText: 'Save',
        cancelButtonText: 'Cancel',
        dataActions: ['before create', 'before edit', 'before delete'],
        workflowActions: ['notify', 'validate', 'execute', 'web service'],
        resetRule: resetCurrentRule
      };
    }

    /**
     * reset the current active rule on scope
     */
    function resetCurrentRule() {
      $scope.rule = null;
    }

    /**
     * ajax call to get the rules list
     */
    function getRules() {
      RulesService.get().then(successHandler, errorHandler)
    }

    /**
     * extract and bind the data to the scope
     * @param data
     */
    function successHandler(data) {
      self.items = data.data.data;
    }

    /**
     * delegate errors to the notification service
     * @param error
     * @param message
     */
    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }
  }

  angular.module('app')
    .controller('RulesController', ['$modal', '$scope', 'RulesService', 'NotificationService', RulesController]);
}());
