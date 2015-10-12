(function () {

  angular.module('backand')
    .controller('SecurityController', [
      '$scope',
      '$state',
      '$filter',
      '$modal',
      'SecurityMatrixService',
      'NotificationService',
      'SecurityService',
      'ColumnsService',
      'DataService',
      'DictionaryService',
      'TablesService',
      'ConfirmationPopup',
      'tableName',
      SecurityController]);

  function SecurityController(
    $scope,
    $state,
    $filter,
    $modal,
    SecurityMatrixService,
    NotificationService,
    SecurityService,
    ColumnsService,
    DataService,
    DictionaryService,
    TablesService,
    ConfirmationPopup,
    tableName) {

    var self = this;

    (function init() {

      self.getUserObjectFields = getUserObjectFields;
      self.currentObjectName = tableName;
      self.appObjects = TablesService.tables;
      var userObject = getItemByRegex(self.appObjects, /user/i);
      self.filter = {
        userObjectName: userObject ? userObject.name : null
      };
      getUserObjectFields();

      self.placeHolderSql = "'{{sys::username}}' = ProjectUserEmail";
      self.placeHolderJson = '{"title":{"$gt":"aaa"}}';
      self._lastPermissions = null;
      self.workspaces = null;
      self.view = null;

      self.savePermanentFilter = savePermanentFilter;

      //Security Matrix
      self.templateChanged = templateChanged;
      self.templateRoleAdd = templateRoleAdd;
      self.templateRoleRename = templateRoleRename;
      self.templateRoleRemove = templateRoleRemove;

      getWorkspaces();

      //Dictionary
      self.dictionaryItems = {};
      self.dictionaryState = false;
      self.toggleOptions = toggleDictionary;
      self.insertAtChar= insertTokenAtChar;
    }());


    self.getPermanentFilterModel = function () {
      return self.sqlFilter ? 'permanentFilter' : 'jsonPermanentFilter';
    };

    function getItemByRegex (object, regex) {
      return _.find(object, function(item) {
        return regex.test(item.name);
      });
    }

    function getUserObjectFields () {
      self.filter.emailField = null;
      self.filter.userObjectFields = [];
      if (!self.filter.userObjectName) return;
      return ColumnsService.getColumns(self.filter.userObjectName)
        .then(function (result) {
          self.filter.userObjectFields = result.data.fields;
          var emailField = getItemByRegex(result.data.fields, /email/i);
          self.filter.emailField = emailField ? emailField.name : null;
        })
    }

    self.getFilterCode = function () {
      return SecurityService.getFilterCode(self.currentObjectName, self.filter.userObjectName, self.filter.emailField)
        .then(function (response) {
          self.filter.result = response.data.where;
          return openValidationModal(response)
        })
        .then(function (result) {
          if (result) {
            updateFilter(self.filter.result)
          }
        })
    };

    function openValidationModal (response) {

      var modalInstance = $modal.open({
        templateUrl: 'common/modals/confirm_update/confirm_update.html',
        controller: 'ConfirmModelUpdateController as ConfirmModelUpdate',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          validationResponse: function () {
            return response.data;
          },
          itemName: function () { return 'query'; }
        }
      });

      return modalInstance.result;
    }

    function updateFilter (result) {
      if (!_.isEmpty(self.view.dataEditing.permanentFilter)) {
        return ConfirmationPopup.confirm('Would you like to replace the current pre-defined filter?')
          .then(function (approve) {
            if (approve) {
              return updateAndSaveFilter(result);
            }
          });
      } else {
        return updateAndSaveFilter(result);
      }
    }

    function updateAndSaveFilter (filter) {
      self.view.dataEditing.permanentFilter = filter;
      return self.savePermanentFilter();
    }

    self.transformNoSQL = function () {

      try {
        var q = JSON.parse(self.view.dataEditing.permanentNoSqlFilter)
      } catch (error) {
        NotificationService.add('error', 'JSON is not properly formatted');
        self.loading = false;
        return;
      }

      return SecurityService.transformNoSQL({
        json: {
          object: self.currentObjectName,
          isFilter:true,
          q: q
        }
      }).then(function (response) {
          self.filter.result = response.data.sql;
          return openValidationModal(response)
        })
        .then(function (result) {
          if (result) {
            updateFilter(self.filter.result)
          }
        })
    };

    /**
     * switch the state of the dictionary window
     */
    function toggleDictionary() {
      self.dictionaryState = !self.dictionaryState;
    }

    /**
     * success handle for getting dictionary items
     * @param data
     */
    function populateDictionaryItems(data) {
      var raw = data.data;
      var keys = Object.keys(raw);
      self.dictionaryItems = {
        headings: {
          tokens: keys[0]
        },
        data: {
          tokens: raw[keys[0]]
        }
      };
    }

    /**
     * broadcast insert event from the parent scope
     * element id used by jquery to locate the element
     * @param elementId
     * @param token
     */
    function insertTokenAtChar(elementId, token) {
      $scope.$parent.$broadcast('insert:placeAtCaret', [elementId, "{{" + token + "}}"]);
    }

    /**
     * Read the list of workspaces
     */
    function getWorkspaces() {
      DictionaryService.get("read").then(populateDictionaryItems);

      if (self.workspaces == null) {
        SecurityService.appName =
          SecurityService.getWorkspace().then(workspaceSuccessHandler, errorHandler)
      }
    }

    /**
     * @param data
     * @constructor
     */
    function workspaceSuccessHandler(data) {
      self.workspaces = data.data.data;

      if (self.view == null)
        ColumnsService.get().then(successHandler, errorHandler)
    }

    /**
     * extract and bind the data to the scope
     * @param data
     */
    function successHandler(data) {
      self.view = data;
      self.currentST = String(self.view.permissions.securityWorkspace);
      buildTemplate();
    }

    /**
     * Save the changes in the matrix to the view
     * @param template
     */
    function templateChanged (template) {
      var permissions = SecurityMatrixService.getPermission(template);
      if(self._lastPermissions == null || JSON.stringify(permissions) == JSON.stringify(self._lastPermissions))
      {
        self._lastPermissions = permissions;
        return;
      }
      self.view.permissions.allowCreateRoles = permissions.allowCreate;
      self.view.permissions.allowEditRoles = permissions.allowEdit;
      self.view.permissions.allowDeleteRoles = permissions.allowDelete;
      self.view.permissions.allowReadRoles = permissions.allowRead;

      ColumnsService.commit(self.view);
    }

    function savePermanentFilter() {
      self.filterError = null;
      return ColumnsService.commitAndUpdate(self.view)

        .then(function (result) {
          return DataService.get(self.currentObjectName);
        })
        .catch(function (error) {
          self.filterError = error.data;
        });
    }

    /**
     * Add new role
     * @param roleName
     * @returns {*}
     */
    function templateRoleAdd (roleName){
      return SecurityService.postRole({Name: roleName, Description: roleName});
    }

    function  templateRoleRename(roleName, newName){
      return SecurityService.updateRole({Name: newName, Description: newName}, roleName);
    }

    function templateRoleRemove(roleName){
      return SecurityService.deleteRole(roleName);
    }



    $scope.$watch(function () { return self.currentST }, function (newVal, oldValue) {
      if (newVal != null && oldValue != null && newVal !== oldValue)
      {
        self.view.permissions.securityWorkspace = Number(self.currentST);
        buildTemplate();
      }
    });

    function buildTemplate() {
      self.sTemplate = [];
      var permissions = {};
      self.appName = SecurityMatrixService.appName = $state.params.appName;

      //check if override is on - if yes read the permissions from the workspace (security group)
      //self.view.override
      if (!self.view.permissions.overrideinheritable) {
        //read the permission from the workspace
        var ws = $filter('filter')(self.workspaces, function (f) {
          return f.__metadata.id == String(self.view.permissions.securityWorkspace);
        });

        if (!ws || !ws[0]) {
          NotificationService.add('error', "Can't find security template");
          return;
        }

        permissions.allowCreate = ws[0].allowCreate;
        permissions.allowEdit = ws[0].allowEdit;
        permissions.allowDelete = ws[0].allowDelete;
        permissions.allowRead = ws[0].allowRead;

      }
      else {

        permissions.allowCreate = self.view.permissions.allowCreateRoles;
        permissions.allowEdit = self.view.permissions.allowEditRoles;
        permissions.allowDelete = self.view.permissions.allowDeleteRoles;
        permissions.allowRead = self.view.permissions.allowReadRoles;
        self._lastPermissions = permissions;
      }
      //if no, read the permissions from the User
      SecurityMatrixService.loadMatrix(permissions).then(function (data) {
        self.sTemplate = data;
      })
    }

    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }

  }

}());
