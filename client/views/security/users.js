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
    self.gridOptions.columnDefs= [
        { name: 'FirstName' },
        { name: 'LastName' },
        { name: 'Username',enableCellEdit: false },
        { name: 'Email' },
        { name: 'durados_User_Role',displayName:'Role', editableCellTemplate :'ui-grid/dropdownEditor',editDropdownOptionsArray:self.roles},
        { name: 'IsApproved',displayName:'Approved',type: 'boolean' }
      ];
    //self.gridOptions.rowEditWaitInterval =750;
    self.addUser = function(){

     /* $scope.gridOpts.data.push({
    "FirstName": "New " + n,
    "LastName": "Person " + n,
    "Username": "abc",
    "Email": true,
    "durados_User_Role" :"",
    IsApproved:false
  });*/
  }
    $scope.modal = {
      title: 'Application User',
      okButtonText: 'Save',
      cancelButtonText: 'Cancel',
      roles: self.roles

    };
    function newUser(){
      $scope.modal.mode = 'new';
      //resetCurrentRule();
      launchModal();
    }
    function getUsers() {
      SecurityService.getUsers($stateParams.name, 20)
        .then(usersSuccsessHandler, errorHandler);
    };
    getUsers();
    var defaultUser = {
      Email: "",
      IsApproved: true,
      durados_User_Role: "User",
      FirstName:"",
      LastName:"",
      Email:""



    };
    function usersSuccsessHandler(data) {

      self.gridOptions.data =data.data.data;
      SecurityService.getRoles($stateParams.name, 20)
        .then(rolesSuccsessHandler, errorHandler);

    }
    function rolesSuccsessHandler(data){
      angular.forEach(data.data.data,function(item){
        var entry ={'id':item.Name,value:item.Name}
        self.roles.push(entry);
      });
      //self.roles.push()= data.data.data;
    }
    $scope.saveRow = function( rowEntity ) {
      // create a fake promise - normally you'd use the promise returned by $http or $resource
      var promise = SecurityService.update($stateParams.name,self.tableName,rowEntity);
      $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );

    };
    self.gridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      $scope.gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };
    function errorHandler(error, message) {
      NotificationService.add('error', message);
      self.gridOptions
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
        /*case 'update':
          updateRule(rule);
          break;*/
      }
    };

    /**
     * extend the default rule object and
     * delegate to rulesService post method
     * @param rule
     */
    function postNewUser(user) {
      defaultUser.Username =user.Email;
      var data = angular.extend(defaultUser, user);
      SecurityService.post($stateParams.name,self.tableName,data).then(getUsers);
      modalInstance.close()
    }

    /**
     * delegate to the update method on
     * rules service
     * @param rule
     */
    /*function updateRule(rule) {
      RulesService.update(rule).then(getRules);
      modalInstance.close();
    }*/

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
