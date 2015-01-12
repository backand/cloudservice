/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityUsers($window,$modal,$stateParams, $log, NotificationService, SecurityService, $scope) {

    var self = this;

    self.tableName='v_durados_user';
    self.open = newUser;
    self.roles = [];
    self.gridOptions= {};
    self.appName= SecurityService.appName= $stateParams.name;

    self.gridOptions.rowEditWaitInterval =200;
    /*self.gridOptions.afterSelectionChange= function(rowItem, event) {
      $scope.rowId = rowItem.rowIndex;
      //$scope.item_id = rowItem.entity.item_id;
      $scope.descp = rowItem.entity.descp;

      //solution: get the index of array from rowMap by rowIndex
      $scope.arrayIdx = $scope.gridOptions.ngGrid.rowMap.indexOf(rowItem.rowIndex);
    };*/
      function getUsers() {
      SecurityService.getUsers()
        .then(usersSuccessHandler, errorHandler);

    }
    function rolesSuccessHandler(data) {
      self.roles = data.data.data;
      self.gridOptions.columnDefs[4].editDropdownOptionsArray =  self.roles;
      $scope.modal.roles=self.roles;

    }
    function usersSuccessHandler(data) {
      self.gridOptions.data =data.data.data;
      SecurityService.getRoles()
        .then(rolesSuccessHandler, errorHandler);
    }
    function usersDeleteSuccessHandler(data){
      NotificationService.add('error', "row was deleted");

      getUsers();
    }


    getUsers();
    self.gridOptions.multiSelect=false;
    self.gridOptions.enableSelectAll= false;
    self.gridOptions.columnDefs= [
      { name: 'FirstName' },
      { name: 'LastName' },
      { name: 'Username',enableCellEdit: false },
      { name: 'Email' },
      { name: 'durados_User_Role',displayName:'Role', editableCellTemplate :'ui-grid/dropdownEditor',editDropdownOptionsArray:[],editDropdownIdLabel:'Name',editDropdownValueLabel:'Name'},
      { name: 'IsApproved',displayName:'Approved',type: 'boolean' }
    ];
    function newUser(){
      $scope.modal.mode = 'new';
      launchModal();
    }
    self.delete = function(){
      var item = $scope.gridApi.selection.getSelectedRows();

      if(!item) {
        NotificationService.add('error', 'no user was selected, please select a row');
        return;
      }

      var result = $window.confirm('You are going to delete '+item[0].Username+ '. are sure you want to continue?');
      if(!result)
        return;
      SecurityService.deleteUser(item[0].ID)
        .then(usersDeleteSuccessHandler, errorHandler);
    };
    var defaultUser = {
      Email: "",
      IsApproved: true,
      durados_User_Role: "User",
      FirstName:"",
      LastName:"",
      Email:""

    };
    $scope.modal = {
      title: 'Application User',
      okButtonText: 'Save',
      cancelButtonText: 'Cancel',
      roles:[]

    };
    $scope.saveRow = function( rowEntity ) {
      rowEntity.IsApproved=rowEntity.IsApproved=='Yes'?true:false;
      var promise = SecurityService.updateUser(rowEntity);
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
      templateUrl: 'views/security/user/new_user.html',
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
      SecurityService.postUser(data).then(getUsers);
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
