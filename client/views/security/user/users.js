/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityUsers(ConfirmationPopup, $modal, $state, $log, usSpinnerService, NotificationService, SecurityService, $scope, SessionService, AppsService, AnalyticsService, AuthService) {

    var self = this;

    /**
     * Init the users page
     */
    (function init() {

      self.roleFieldName = 'Role';
      self.open = newUser;
      self.roles = null;
      self.gridOptions = {};
      self.appName = SecurityService.appName = $state.params.appName;
      self.actions = ['Delete'];
      self.action = '';
      self.showFilter = true;
      self.lastQuery = [];

      self.invitedUsers = '';
      self.invitedAdmins = '';
      self.sort = '[{fieldName:"Username", order:"desc"}]';

      self.adminMode = ($state.$current.url.source.indexOf('/team') > -1);;
      self.title = self.adminMode ? 'Team' : 'Registered Users';

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
          {name: 'Username', enableCellEdit: false, sort: {direction: 'asc', priority: 0}},
          {name: 'FirstName'},
          {name: 'LastName'},
          {
            name: self.roleFieldName,
            displayName: 'Role',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: [],
            editDropdownIdLabel: 'Name',
            editDropdownValueLabel: 'Name',
            cellEditableCondition: function($scope){
              return !($scope.row.entity.Role === "Admin");
            },
            enableSorting: false
          },
          {
            name: 'IsApproved',
            displayName: 'Is Approved',
            type: 'boolean',
            cellEditableCondition: function($scope){
              return !($scope.row.entity.Username === SessionService.currentUser.username);
            }
          },
          {field: 'readyToSignin', displayName: 'Ready to sign-in', enableCellEdit: false}
        ]
      };

      self.gridOptions.columnDefs.unshift({
        name: 'getUserToken',
        cellTemplate: '<div class="grid-icon" ng-click="grid.appScope.users.getUserToken($event, row)"><i class="ti-key"/></div>',
        width: 30,
        displayName: '',
        enableSorting: false,
        enableColumnMenu: false,
        enableCellEdit: false
      });

      if (!self.adminMode) {
        self.gridOptions.columnDefs.unshift({
          name: 'changePassword',
          cellTemplate: '<div class="grid-icon" ng-click="grid.appScope.users.changePassword($event, row)"><i class="ti-lock"/></div>',
          width: 30,
          displayName: '',
          enableSorting: false,
          enableColumnMenu: false,
          enableCellEdit: false
        });
      }

      getFilterOptions();

      $scope.$watch(function () {
        if (self.paginationOptions)
          return self.paginationOptions.pageNumber
      }, getRoles);

      //getRoles();

      //get the default role for invited users
      successApp(AppsService.currentApp);

    }());

    self.changePassword = function (event, row) {

      if(!row.entity.readyToSignin){
        ConfirmationPopup.confirm('Change password is only for users that ready for sign in','OK', '', true, false, 'Change Password');
      }
      else {
        var modalInstance = $modal.open({
          templateUrl: 'views/security/user/change_user_password.html',
          controller: 'ChangeUserPasswordController as ChangeUserPassword',
          resolve: {
            username: function () {
              return row.entity.Username;
            }
          }
        });
      }
    };

    self.getUserToken  = function (event, row) {
      var modalInstance = $modal.open({
        templateUrl: 'views/security/user/get_user_token.html',
        controller: 'GetUserTokenController as GetUserToken',
        resolve: {
          username: function () {
            return row.entity.Username;
          }
        }
      });
    };

    function getRoles(){

      usSpinnerService.spin('loading');
      if (self.roles == null) {
        SecurityService.getRoles()
          .then(rolesSuccessHandler, errorHandler);
      }
      else {
        getUsers();
      }
    }

    function rolesSuccessHandler(data) {
      // Remove admin role
      self.roles = _.reject(data.data.data, {Name: 'Admin'});
      self.gridOptions.columnDefs[self.adminMode ? 4 : 5].editDropdownOptionsArray = self.roles;

      $scope.modal.roles = self.roles.map(function (role) {
          return role.Name;
      });

      getUsers();
    }

    function getUsers() {
      //var roleFilter = self.adminMode ? 'Admin' : '%';//_.without(_.map(self.roles, 'Name'),'Admin').join(',');

      if(self.adminMode){

        SecurityService.getUsers(
          self.paginationOptions.pageSize,
          self.paginationOptions.pageNumber,
          self.sort,
          self.lastQuery)
          .then(usersSuccessHandler, errorHandler);
      }
      else {

        SecurityService.getUsers(
          self.paginationOptions.pageSize,
          self.paginationOptions.pageNumber,
          self.sort,
          self.lastQuery)
          .then(usersSuccessHandler, errorHandler);
      }
        //The , before the filter is a bug
      //'[{fieldName:"Email", operator:"notEquals", value:"guest@durados.com"},' +
      //'{fieldName:"Role", operator:"in", value:",' + roleFilter + '"}]')
    }


    function usersSuccessHandler(data) {
      self.gridOptions.data = data.data.data;
      self.gridOptions.totalItems = data.data.totalRows;
      self.roleFieldName = self.gridOptions.data[0] && self.gridOptions.data[0].Role ? 'Role' : self.roleFieldName;
      self.gridOptions.columnDefs[self.adminMode ? 4 : 5].name = self.roleFieldName;

      usSpinnerService.stop('loading');
    }

    function usersDeleteSuccessHandler(data) {
      //NotificationService.add('error', "row was deleted");
      getRoles();
    }

    function successApp(data){
      self.defaultUserRole = data.settings.newUserDefaultRole || 'User';
      self.registrationRedirectUrl = data.settings.registrationRedirectUrl || '';
    }

    self.goTo = function(state) {
      $state.go(state);
    };

    function newUser() {
      $scope.modal.mode = 'new';
      $scope.modal.NewUser = true;
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

      ConfirmationPopup.confirm('You are going to delete ' + items.length + ' user(s). Are you sure you want to continue?')
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
        getRoles();
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
      data.Role = role;
      //if (self.roleFieldName.toLowerCase() === 'durados_user_role')
      //  data.durados_User_Role = role;
      //else
      //  data.Role = role;
    }

    <!-- Filter -->

    self.disableValue = function (operator) {
      return ['empty', 'notEmpty'].indexOf(operator) > -1;
    };

    function filterValid (item) {
      return item.field
          && item.operator
          && (item.value || self.disableValue(item.operator));
    }

    self.filterData = function () {

      usSpinnerService.spin("loading");

      var query = _.map(self.filterQuery, function (item) {

        if (filterValid(item)) {
          return {
            fieldName: item.field.name,
            operator: item.operator || 'equals',
            value: self.disableValue(item.operator) ? '' : item.value || ''
          };
        }
      });

      query = _.compact(query);
      if (_.isEqual(query, self.lastQuery)) {
        usSpinnerService.stop("loading");
        return;
      }
      self.lastQuery = query;

      if(self.adminMode) {
        self.lastQuery.push({fieldName: "Email", operator: "notEquals", value: "guest@durados.com"});
        self.lastQuery.push({fieldName: "Role", operator: "in", value: ",Admin"});
      }
      else{
        self.lastQuery.push({fieldName:"Email", operator:"notEquals", value:"guest@durados.com"});
      }

      getUsers();

    };

    function getFilterOptions () {
      self.filterOptions = {
        fields: getFieldsForFilter(),
        operators: null
      };
      self.filterReady = true;
      self.lastQuery = [];
      if(self.adminMode) {
        self.lastQuery.push({fieldName: "Email", operator: "notEquals", value: "guest@durados.com"});
        self.lastQuery.push({fieldName: "Role", operator: "in", value: ",Admin"});
      }
      else{
        self.lastQuery.push({fieldName:"Email", operator:"notEquals", value:"guest@durados.com"});
      }
    }

    function getFieldsForFilter () {
      return [
        {name: "Username", "type":"text"},
        {name: "FirstName",type:"text"},
        {name: "LastName",type:"text"},
        {name: "IsApproved",type:"Boolean"}
      ];
    }

    <!-- End Filter -->

    /**
     * extend the default user object and
     * delegate to SecurityService post method
     * @param user
     */

    self.isEmail = function (email) {
      if (email == '') return false;
      if (email.indexOf("@") <= 0) return false;
      return true;
    };

    self.inviteAdmins = function () {

      AnalyticsService.track('AddedAdmin', {admins: self.invitedAdmins});
      self.inviteUsers(self.invitedAdmins, 'Admin');
    };

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
          NotificationService.add('error', email_array[i] + ' is not a valid email')
        }
        i++;
      }
      return isValid;
    };

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
        NotificationService.add('error', 'please fix the erroneous emails and try again');
        return;
      }
      if (email_array.length > 20) {
        NotificationService.add('error', 'The maximum emails allowed is 20.');
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
        SecurityService.postUser(user).then(getRoles, errorHandler);
      }

      if (emails_string)
        self.invitedAdmins = '';
      else
        self.invitedUsers = '';

    };

    /**
     * init and launch modal window and
     * pass it a scope
     */
    function launchModal() {

      self.modalInstance = $modal.open({
        templateUrl: 'views/security/user/new_user.html',
        backdrop: 'static',
        scope: $scope
      });

      $scope.changeEmail = function (user){
        if(user.email){
          SecurityService.userExists(user.email)
          .then(function (data) {
            $scope.modal.NewUser = !data.data.exists;
          }, function(err){
            console.log(err.data.Message)
            // do nothing
          })
        }
        else
          $scope.modal.NewUser = true;
      };

      $scope.closeModal = function (user) {
        user.password = user.password || '';
        user.confirmPassword = user.confirmPassword || '';
        if (AuthService.validatePassword(user.password)) {
          SecurityService.newUser(user)
            .then(function () {
              self.modalInstance.close();
              getRoles();
            });
        }
      };
      /**
       * close the modal window if user confirm
       */
      $scope.cancel = function () {
        self.modalInstance.dismiss();
      };
    }

  }

  angular.module('backand')
    .controller('SecurityUsers', [
      'ConfirmationPopup',
      '$modal',
      '$state',
      '$log',
      'usSpinnerService',
      'NotificationService',
      'SecurityService',
      '$scope',
      'SessionService',
      'AppsService',
      'AnalyticsService',
      'AuthService',
      SecurityUsers
    ]);

}());
