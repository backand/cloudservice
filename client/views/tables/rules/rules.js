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

      $scope.cancel= function () {
        modalInstance.dismiss()
      };

      $scope.modal = {
        title: 'New Application Rule',
        okButtonText : 'Save Rule',
        cancelButtonText : 'Cancel'
      };

    };

    self.open();

  }

  angular.module('app')
    .controller('RulesController', ['$modal', '$scope', RulesController]);
}());
