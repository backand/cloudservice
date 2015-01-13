/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityUsers($window, $modal, $stateParams, $log, NotificationService, SecurityService, $scope) {

    var self = this;

    self.tableName = 'v_durados_user';
    self.open = newUser;
    self.roles = [];
    self.gridOptions = {};
    self.appName = SecurityService.appName = $stateParams.name;

    self.invitedUsers = '';
    self.invitedAdmins = '';
    self.processingInviteUsers=false;
    self.processingInviteAdmins=false;
    self.gridOptions.rowEditWaitInterval = 200;
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
      self.gridOptions.columnDefs[4].editDropdownOptionsArray = self.roles;
      $scope.modal.roles = self.roles;

    }

    function usersSuccessHandler(data) {
      self.gridOptions.data = data.data.data;
      SecurityService.getRoles()
        .then(rolesSuccessHandler, errorHandler);
    }

    function usersDeleteSuccessHandler(data) {
      NotificationService.add('error', "row was deleted");

      getUsers();
    }


    getUsers();
    self.gridOptions.multiSelect = false;
    self.gridOptions.enableSelectAll = false;
    self.gridOptions.columnDefs = [
      {name: 'FirstName'},
      {name: 'LastName'},
      {name: 'Username', enableCellEdit: false},
      {name: 'Email'},
      {
        name: 'durados_User_Role',
        displayName: 'Role',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownOptionsArray: [],
        editDropdownIdLabel: 'Name',
        editDropdownValueLabel: 'Name'
      },
      {name: 'IsApproved', displayName: 'Approved', type: 'boolean'}
    ];
    function newUser() {
      $scope.modal.mode = 'new';
      launchModal();
    }

    self.delete = function () {
      var item = $scope.gridApi.selection.getSelectedRows();

      if (!item) {
        NotificationService.add('error', 'no user was selected, please select a row');
        return;
      }

      var result = $window.confirm('You are going to delete ' + item[0].Username + '. are sure you want to continue?');
      if (!result)
        return;
      SecurityService.deleteUser(item[0].ID)
        .then(usersDeleteSuccessHandler, errorHandler);
    };
    var defaultUser = {
      Email: "",
      IsApproved: true,
      durados_User_Role: "User",
      FirstName: "",
      LastName: "",
      Email: ""

    };
    $scope.modal = {
      title: 'Application User',
      okButtonText: 'Save',
      cancelButtonText: 'Cancel',
      roles: []

    };
    $scope.saveRow = function (rowEntity) {
      rowEntity.IsApproved = rowEntity.IsApproved == 'Yes' ? true : false;
      var promise = SecurityService.updateUser(rowEntity);
      $scope.gridApi.rowEdit.setSavePromise($scope.gridApi.grid, rowEntity, promise);

    };
    self.gridOptions.onRegisterApi = function (gridApi) {
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
     * extend the default user object and
     * delegate to SecurityService post method
     * @param user
     */
    self.postNewUser = function (user) {

      var data = angular.extend(defaultUser, user);
      data.Username = user.Email;
      data.durados_User_Role = user.durados_User_Role.Name;
      SecurityService.postUser(data).then(getUsers);
      modalInstance.close();
    }
    self.isEmail = function (email) {
      if (email == '') return false;
      if (email.indexOf("@") <= 0) return false;
      return true;
    }
    self.inviteAdmins = function () {
      self.processingInviteAdmin=true;
      self.inviteUsers(self.invitedAdmins,'Admin');
      self.processingInviteUsers=false;
    }
    self.validateEmail = function(email_array) {
      var isValid=true;
      for (var i = 0; i < email_array.length; ) {
        // Trim the excess whitespace.
        email_array[i] = email_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
        if (email_array[i]=='') {
          email_array.splice(i,1);
          i--;
        }
        if (!self.isEmail(email_array[i])) {
          isValid = false;
          NotificationService.add('error', email_array[i] + 'is not an email')
        }
        i++;
      }
      return isValid;
    }

    self.inviteUsers = function (emails_string,role) {
      self.processingInviteUsers=true;
      var userRole= role?role:'User';
      var emails = emails_string?emails_string:self.invitedUsers;
      var email_array = emails.split(',');

      if(!self.validateEmail(email_array)){
        NotificationService.add('error', 'please fix the erroneous emails and try again')
        return;
      }
      if(email_array.length>20){
        NotificationService.add('error', 'The maximun emails allowed is 20.')
        return;
      }
      for (var i = 0; i < email_array.length; i++) {
          var name = email_array[i].split("@");
          var user = {
            Username: email_array[i],
            Email: email_array[i],
            IsApproved: true,
            durados_User_Role: userRole,
            FirstName: name[0],
            LastName: name[1]
          };
          SecurityService.postUser(user)
            .then(getUsers,errorHandler);
          ;

      }
      if(emails_string)
        self.invitedAdmins='';
      else
        self.invitedUsers='';
      self.processingInviteUsers=false;
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
            self.postNewUser(user);
            break;

        }
      };


      /**
       * close the modal window if user confirm
       */
      $scope.cancel = function () {
        var result = $window.confirm('Changes will be lost. are sure you want to close this window?');
        result ? modalInstance.dismiss() : false;
      };

    }

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
