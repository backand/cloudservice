/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityUsers($stateParams, $log, NotificationService, SecurityService, $scope) {

    var self = this;
    self.tableName='v_durados_user';
    self.roles = [];
    self.gridOptions= {};
    self.gridOptions.columnDefs= [
        { name: 'FirstName' },
        { name: 'LastName' },
        { name: 'Username',enableCellEdit: false },
        { name: 'Email' },
        { name: 'durados_User_Role',displayName:'Role' ,editDropdownOptionsArray:self.roles},
        { name: 'IsApproved',displayName:'Approved',type: 'boolean' }
      ];
    //self.gridOptions.rowEditWaitInterval =750;
self.addData = function(){

  $scope.gridOpts.data.push({
    "FirstName": "New " + n,
    "LastName": "Person " + n,
    "Username": "abc",
    "Email": true,
    "durados_User_Role" :"",
    IsApproved:false
  });}
    SecurityService.getUsers($stateParams.name, 20)
      .then(usersSuccsessHandler, errorHandler);

    function usersSuccsessHandler(data) {

      self.gridOptions.data =data.data.data;
      SecurityService.getRoles($stateParams.name, 20)
        .then(rolesSuccsessHandler, errorHandler);

    }
    function rolesSuccsessHandler(data){
      self.roles= data.data.data;
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

  }

  angular.module('app')
    .controller('SecurityUsers', [
      '$stateParams',
      '$log',
      'NotificationService',
      'SecurityService',
      '$scope',
      SecurityUsers
    ]);

}());
