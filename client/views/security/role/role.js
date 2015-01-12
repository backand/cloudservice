/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityUsers($window,$modal,$stateParams, $log, NotificationService, SecurityService, $scope) {

    var self = this;

    self.tableName='durados_UserRole';
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
      SecurityService.getRoles($stateParams.name, 20)
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
      { name: 'Name',enableCellEdit: false },
      { name: 'Description' },

    ];
    function newUser(){
      $scope.modal.mode = 'new';
      launchModal();
    }
    self.delete = function(){
      var item = $scope.gridApi.selection.getSelectedRows();

      if(!item) {
        NotificationService.add('error', 'no role was selected, please select a row');
        return;
      }

      var result = $window.confirm('You are going to delete '+item[0].Name+ '. are sure you want to continue?');
      if(!result)
        return;
      SecurityService.deleteRole($stateParams.name,item[0].ID)
        .then(roleDeleteSuccessHandler, errorHandler);
    };

    $scope.modal = {
      title: 'Application Role',
      okButtonText: 'Save',
      cancelButtonText: 'Cancel',

    };
    $scope.saveRow = function( rowEntity ) {

      var promise = SecurityService.updateRole($stateParams.name,rowEntity);
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


  /**
   * init and launch modal window and
   * pass it a scope
   */
  function launchModal() {

    var modalInstance = $modal.open({
      templateUrl: 'views/security/new_user.html',
      backdrop: 'static',
      scope: $scope
    });



    $scope.closeModal = function (user) {
      switch ($scope.modal.mode) {
        case 'new':
          postNewUser(user);
          break;

      }
    };

    /**
     * extend the default user object and
     * delegate to SecurityService post method
     * @param user
     */
    function postNewUser(user) {

      var data = angular.extend(defaultUser, user);
      data.Username=user.Email;
      data.durados_User_Role = user.durados_User_Role.Name;
      SecurityService.post($stateParams.name,self.tableName,data).then(getUsers);
      modalInstance.close();
    }


    /**
     * close the modal window if user confirm
     */
    $scope.cancel = function () {
      var result = $window.confirm('Changes will be lost. are sure you want to close this window?');
      result ? modalInstance.dismiss() : false;
    };

  }
    $scope.cancel = function () {
      var result = $window.confirm('Changes will be lost. are sure you want to close this window?');
      result ? modalInstance.dismiss() : false;
    };
  }
  angular.module('app')
    .controller('SecurityUsers', [
      '$window',
      '$modal',
      '$stateParams',
      '$log',
      'NotificationService',
      'SecurityService',
      '$scope',
      SecurityUsers
    ]);

}());
