/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {

  function RulesController($modal, $scope) {

    var self = this;


    self.open = function () {

      var modalInstance = $modal.open({
        templateUrl: 'views/tables/rules/new_rule.html',
        backdrop: 'static',
        scope: $scope
      });

      $scope.close = function () {
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
        workflowActions: ['notify', 'validate', 'execute', 'web service']
      };

      $scope.currentRule = {

      }

    };


  }

  angular.module('app')
    .controller('RulesController', ['$modal', '$scope', RulesController]);
}());
