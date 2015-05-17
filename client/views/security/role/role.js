/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityUsers(ConfirmationPopup, CONSTS, $stateParams, $log, NotificationService, SecurityService, $scope) {

    var self = this;

    self.tableName = CONSTS.backandRoleObject;
    self.open = newRole;

    self.gridOptions= {};

    self.gridOptions.rowEditWaitInterval =200;
    /*self.gridOptions.afterSelectionChange= function(rowItem, event) {
      $scope.rowId = rowItem.rowIndex;
      //$scope.item_id = rowItem.entity.item_id;
      $scope.descp = rowItem.entity.descp;

      //solution: get the index of array from rowMap by rowIndex
      $scope.arrayIdx = $scope.gridOptions.ngGrid.rowMap.indexOf(rowItem.rowIndex);
    };*/
      function getRoles() {
      SecurityService.getRoles($stateParams.appName, 20)
        .then(rolesSuccessHandler, errorHandler);

    }
    function rolesSuccessHandler(data) {
      self.roles = data.data.data;
      $scope.modal.roles=self.roles;

    }

    function roleDeleteSuccessHandler(data){
      NotificationService.add('error', "row was deleted");
      getRoles();
    }

    getRoles();
    self.gridOptions.multiSelect=false;
    self.gridOptions.enableSelectAll= false;
    self.gridOptions.columnDefs= [
      { name: 'Name', enableCellEdit: false },
      { name: 'Description' }
    ];

    self.delete = function() {
      var item = $scope.gridApi.selection.getSelectedRows();

      if(!item) {
        NotificationService.add('error', 'no role was selected, please select a row');
        return;
      }

      ConfirmationPopup.confirm('You are going to delete '+item[0].Name+ '. are sure you want to continue?')
        .then(function(result) {
        if(!result)
          return;
        SecurityService.deleteRole($stateParams.appName, item[0].ID)
          .then(roleDeleteSuccessHandler, errorHandler);
      });

    };

    $scope.modal = {
      title: 'Application Role',
      okButtonText: 'Save',
      cancelButtonText: 'Cancel'
    };

    $scope.saveRow = function( rowEntity ) {

      var promise = SecurityService.updateRole($stateParams.appName, rowEntity);
      $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise );

    };
    self.gridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      $scope.gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };
    function errorHandler(error, message) {
      NotificationService.add('error', message);
      self.gridOptions;
      $log.debug(error);
    }

  }
  angular.module('backand')
    .controller('SecurityUsers', [
      'ConfirmationPopup',
      'CONSTS',
      '$stateParams',
      '$log',
      'NotificationService',
      'SecurityService',
      '$scope',
      SecurityUsers
    ]);

}());
