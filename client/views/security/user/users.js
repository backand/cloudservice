/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityUsers(ConfirmationPopup, $modal, $stateParams, $log, usSpinnerService, NotificationService, SecurityService, $scope, SessionService, AppsService) {

    var self = this;

    /**
     * Init the users page
     */
    (function init() {

      self.roleFieldName = 'durados_User_Role';
      self.open = newUser;
      self.roles = null;
      self.gridOptions = {};
      self.appName = SecurityService.appName = $stateParams.name;
      self.actions = ['Delete'];
      self.action = '';

      self.invitedUsers = '';
      self.invitedAdmins = '';
      self.sort = '[{fieldName:"Username", order:"desc"}]';

      self.gridOptions.rowEditWaitInterval = 200;
      self.paginationOptions = {
        pageNumber: 1,
        pageSize: 20,
        pageSizes: [20, 50, 100, 1000]
      };

      self.gridOptions = {
        enableColumnResize: true,
        enablePaginationControls: false,
        useExternalSorting: true,
        multiSelect: true,
        enableSelectAll: false,
        columnDefs: [
          {name: 'FirstName'},
          {name: 'LastName'},
          {name: 'Username', enableCellEdit: false, sort: {direction: 'desc', priority: 0}},
          {name: 'Email'},
          {
            name: self.roleFieldName,
            displayName: 'Role',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: [],
            editDropdownIdLabel: 'Name',
            editDropdownValueLabel: 'Name'
          },
          {name: 'IsApproved', displayName: 'Approved', type: 'boolean'}
        ]
      };

      $scope.$watch('users.paginationOptions.pageNumber', getUsers);
      getUsers();

      //get the default role for invited users
      AppsService.getCurrentApp(self.appName).then(suucessApp, errorHandler)

    }());

    function getUsers() {
      usSpinnerService.spin('loading');
      SecurityService.getUsers(self.paginationOptions.pageSize, self.paginationOptions.pageNumber, self.sort)
        .then(usersSuccessHandler, errorHandler);

    }

    function rolesSuccessHandler(data) {
      self.roles = data.data.data;
      self.gridOptions.columnDefs[4].editDropdownOptionsArray = self.roles;

      $scope.modal.roles = self.roles;
      usSpinnerService.stop('loading');

    }

    function usersSuccessHandler(data) {
      self.gridOptions.data = data.data.data;
      self.gridOptions.totalItems = data.data.totalRows;
      self.roleFieldName = self.gridOptions.data[0] && self.gridOptions.data[0].Role ? 'Role' : self.roleFieldName;
      self.gridOptions.columnDefs[4].name = self.roleFieldName;
      if (self.roles == null)
        SecurityService.getRoles()
          .then(rolesSuccessHandler, errorHandler);
      else
        usSpinnerService.stop('loading');
    }

    function usersDeleteSuccessHandler(data) {
      NotificationService.add('error', "row was deleted");

      getUsers();
    }

    function suucessApp(data){
      self.defaultUserRole = data.settings.newUserDefaultRole || 'User';
    }

    function newUser() {
      $scope.modal.mode = 'new';
      launchModal();
    }

    self.delete = function () {
      var items = $scope.gridApi.selection.getSelectedRows();

      if (!items || items.length == 0) {
        NotificationService.add('error', 'No user was selected, please select row(s)');
        return;
      }

      //get the app creator
      var username = SessionService.currentUser.username;

      var result = ConfirmationPopup.confirm('You are going to delete ' + items.length + ' user(s). Are you sure you want to continue?')
        .then(function (result) {
          if (!result)
            return;
          angular.forEach(items, function(item) {
            if(username==item.Username)
            {
              NotificationService.add('error', 'Can\'t delete the creator of the app');
            }
            else
            {
              SecurityService.deleteUser(item.ID).then(usersDeleteSuccessHandler, errorHandler);
            }
          })
        })

    };

    $scope.modal = {
      title: 'Application User',
      okButtonText: 'Save',
      cancelButtonText: 'Cancel',
      roles: []

    };
    $scope.saveRow = function (rowEntity) {

      var promise = SecurityService.updateUser(rowEntity);
      $scope.gridApi.rowEdit.setSavePromise($scope.gridApi.grid, rowEntity, promise);

    };
    self.gridOptions.onRegisterApi = function (gridApi) {
      //set gridApi on scope
      $scope.gridApi = gridApi;
      $scope.gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
      $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
        /* if(sortColumns[0].name != 'Username')
         self.gridOptions.columnDefs[0].sort.direction = '';*/
        self.sort = '[{fieldName:"' + sortColumns[0].name + '", order:"' + sortColumns[0].sort.direction + '"}]';
        getUsers();
      });

    };
    function errorHandler(error, message) {
      NotificationService.add('error', message);
      $log.debug(error);
    }

    self.pageMax = function (pageSize, currentPage, max) {
      return Math.min((pageSize * currentPage), max);
    };
    /*
     * Legacy support for old Role json name( the new is durados_User_Role and the old is Role
     * */
    function SetDataUserRole(data, role) {
      if (self.roleFieldName == 'Role')
        data.Role = role;
      else
        data.durados_User_Role = role;
    }

    /**
     * extend the default user object and
     * delegate to SecurityService post method
     * @param user
     */


    self.isEmail = function (email) {
      if (email == '') return false;
      if (email.indexOf("@") <= 0) return false;
      return true;
    }

    self.inviteAdmins = function () {
      self.inviteUsers(self.invitedAdmins, 'Admin');
    }

    self.validateEmail = function (email_array) {
      var isValid = true;
      for (var i = 0; i < email_array.length;) {
        // Trim the excess whitespace.
        email_array[i] = email_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
        if (email_array[i] == '') {
          email_array.splice(i, 1);
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

    /**
     * Read the list of emails, split it and call POST user
     * @param emails_string
     * @param role
     */
    self.inviteUsers = function (emails_string, role) {

      var userRole = role ? role : self.defaultUserRole;
      var emails = emails_string ? emails_string : self.invitedUsers;
      var email_array = emails.split(',');

      if (!self.validateEmail(email_array)) {
        NotificationService.add('error', 'please fix the erroneous emails and try again')
        return;
      }
      if (email_array.length > 20) {
        NotificationService.add('error', 'The maximum emails allowed is 20.')
        return;
      }
      for (var i = 0; i < email_array.length; i++) {
        var name = email_array[i].split("@");
        var user = {
          Username: email_array[i],
          Email: email_array[i],
          IsApproved: true,

          FirstName: name[0],
          LastName: name[1]
        };
        SetDataUserRole(user, userRole);
        SecurityService.postUser(user).then(getUsers, errorHandler);
      }

      if (emails_string)
        self.invitedAdmins = '';
      else
        self.invitedUsers = '';

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
       * close the modal window if user confirm
       */
      $scope.cancel = function () {
        var result = ConfirmationPopup.confirm('Changes will be lost. are sure you want to close this window?')
          .then(function (result) {
            result ? modalInstance.dismiss() : false;
          })

      };
      function postNewUser(user) {
        var data = {
          Email: user.Email,
          IsApproved: true,
          FirstName: user.FirstName,
          LastName: user.LastName,
          Username: user.Email

        };
        SetDataUserRole(data, user.durados_User_Role.Name);
        SecurityService.postUser(data).then(getUsers);
        modalInstance.close();
      }
    }

  }

  angular.module('app')
    .controller('SecurityUsers', [
      'ConfirmationPopup',
      '$modal',
      '$stateParams',
      '$log',
      'usSpinnerService',
      'NotificationService',
      'SecurityService',
      '$scope',
      'SessionService',
      'AppsService',
      SecurityUsers
    ]);

}());
