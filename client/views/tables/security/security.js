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

      self.predefinedFilterType = 'nosql';
      self.getUserObjectFields = getUserObjectFields;
      self.currentObjectName = tableName;
      self.appObjects = TablesService.tables;
      var userObject = getItemByRegex(self.appObjects, /user/i);
      self.filter = {
        userObjectName: userObject ? userObject.name : null
      };
      getUserObjectFields();

      self.placeHolderSql = "'{{sys::username}}' = ProjectUserEmail";
      self.placeHolderNoSql = '{"title":{"$gt":"aaa"}}';

      self.workspaces = null;
      self.view = null;

      self.savePermanentFilter = savePermanentFilter;

      //Security Matrix
      self.templateChanged = templateChanged;
      self.templateRoleAdd = templateRoleAdd;
      self.templateRoleRename = templateRoleRename;
      self.templateRoleRemove = templateRoleRemove;
      self.templateFieldChanged = templateFieldChanged;

      getWorkspaces();

      //Dictionary
      self.dictionaryItems = {};
      self.dictionaryState = false;
      self.toggleOptions = toggleDictionary;
      self.insertAtChar= insertTokenAtChar;

      $scope.$watch(checkOverrideChange, onOverrideChange);
    }());

    // Pre-defined filter

    self.ace = {
      editors: {},
      onLoad: function (_editor) {
        self.ace.editors[_editor.container.id] = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    self.saveSqlFilter = function () {
      return replaceFilter(null, 'sql');
    };

    function replaceFilter (result, type) {
      var confirmationMessage =
        type === 'sql' ? 'The NoSQL query will be deleted. Would you like to continue?' :
          'Would you like to replace the current pre-defined filter?';

      if ((type !== 'sql' && self.view.dataEditing.permanentFilter) ||
          (type !== 'nosql' && self.view.dataEditing.nosqlPermanentFilter)) {
        return ConfirmationPopup.confirm(confirmationMessage)
          .then(function (approve) {
            if (approve) {
              if (type === 'sql') {
                self.view.dataEditing.nosqlPermanentFilter = '';
              }
              return updateFilter(result);
            }
          });
      } else {
        return updateFilter(result);
      }
    }

    function updateFilter (filter) {
      self.showWizard = false;
      if (filter && filter.sql) {
        self.view.dataEditing.permanentFilter = filter.sql;
      }
      if (filter && filter.noSql) {
        self.view.dataEditing.nosqlPermanentFilter = filter.noSql;
      }
      return self.savePermanentFilter();
    }

    function savePermanentFilter() {
      return ColumnsService.commitAndUpdate(self.view)

        .then(function (result) {
          return DataService.getDataSample(self.currentObjectName, false, true);
        })
        .catch(function (error) {
          return openErrorModal(error)
        });
    }

    function openErrorModal (error) {

      $modal.open({
        templateUrl: 'common/modals/confirm_update/confirm_update.html',
        controller: 'ConfirmModelUpdateController as ConfirmModelUpdate',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          validationResponse: function () {
            return {valid: 'never', warnings: [_.last(error.data.split('Error details: '))]};
          },
          titles: function () {
            return {
              itemName: 'query',
              actionPhrase: 'The query was saved with errors.'
            }
          }
        }
      });
    }

    self.transformNoSQL = function () {
      if (_.isEmpty(self.view.dataEditing.nosqlPermanentFilter)) {
        self.view.dataEditing.permanentFilter = '';
        return savePermanentFilter();
      }

      try {
        var q = JSON.parse(self.view.dataEditing.nosqlPermanentFilter)
      } catch (error) {
        NotificationService.add('error', 'JSON is not properly formatted');
        self.loading = false;
        return;
      }

      return SecurityService.transformNoSQL({
        object: self.currentObjectName,
        q: q
      }).then(function (response) {
        self.filter.result = response.data.sql;
        return openValidationModal(response)
      })
        .then(function (result) {
          if (result) {
            replaceFilter({sql: self.filter.result}, 'nosql')
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
          titles: function () {
            return {
              itemName: 'query',
              detailsTitle: 'The NoSQL is equivalent to the following SQL query:',
              resultProperty: 'sql'
            }
          }
        }
      });

      return modalInstance.result;
    }

    function toggleAngledWindow (inputType) {
      self.showDictionary = !self.showDictionary;
    }

    function showAngledWindow () {
      return self.showDictionary;
    }

    function insertTokenAtChar(elementId, token) {
      // Handle case of ace editor:
      var aceEditor = self.ace.editors[self.predefinedFilterType];
      if (aceEditor) {
        setTimeout(function () { // DO NOT USE $timeout - all changes to ui-ace must be done outside digest loop, see onChange method in ui-ace
          aceEditor.insert("{{" + token + "}}");
        })
      }
    }

    self.anchorParams = {
      toggleAngledWindow: toggleAngledWindow,
      showAngledWindow: showAngledWindow,
      dictionaryItems: self.dictionaryItems,
      insertAtChar: insertTokenAtChar,
      template: "views/tables/rules/dictionary_window.html",
      dictionarySections: ['userInput', 'dbRow', 'parameters', 'userProfile'],
      getDictionaryItems: function () {return self.dictionaryItems;}
    };

    // Wizard

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
      return SecurityService.getFilterCode(self.currentObjectName, self.filter)
        .then(function (response) {
          self.filter.result = {
            sql: response.data.sql,
            noSql: response.data.nosql
          };
          return openValidationModal(response)
        })
        .then(function (result) {
          if (result) {
            self.filter.result.noSql = angular.toJson(angular.fromJson(self.filter.result.noSql).q, true);
            replaceFilter(self.filter.result, 'getCode');
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

      if (self.view == null){
        loadView();
      }

    }

    function loadView(){
      ColumnsService.get().then(successHandler, errorHandler);
    }

    /**
     * extract and bind the data to the scope
     * @param data
     */
    function successHandler(data) {
      self.view = data;

      //make the view permission like the ws and fields
      self.view.permissions.allowCreate = self.view.permissions.allowCreateRoles;
      self.view.permissions.allowEdit = self.view.permissions.allowEditRoles;
      self.view.permissions.allowDelete = self.view.permissions.allowDeleteRoles;
      self.view.permissions.allowRead = self.view.permissions.allowReadRoles;

      //set the current workspace - security template
      self.currentST = String(self.view.permissions.securityWorkspace);

      // Default view is NoSQL, unless only SQL has value
      if (!self.view.dataEditing.nosqlPermanentFilter) {
        if (self.view.dataEditing.permanentFilter) {
          self.predefinedFilterType = 'sql';
        } else {
          self.showWizard = true;
        }
      }

      rebuildTemplate();
    }

    /**
     * Save the changes in the matrix to the view
     * @param template
     */
    function templateChanged (template) {
      var permissions = SecurityMatrixService.getPermission(template);
      if(self.view.permissions._lastPermissions == null || JSON.stringify(permissions) == JSON.stringify(self.view.permissions._lastPermissions))
      {
        self.view.permissions._lastPermissions = permissions;
        return;
      }
      self.view.permissions.allowCreateRoles = permissions.allowCreate;
      self.view.permissions.allowEditRoles = permissions.allowEdit;
      self.view.permissions.allowDeleteRoles = permissions.allowDelete;
      self.view.permissions.allowReadRoles = permissions.allowRead;

      ColumnsService.commit(self.view);
    }

    /**
     * Save the changes in the matrix to the view
     * @param template
     */
    function templateFieldChanged (field, template) {
      var permissions = SecurityMatrixService.getPermission(template);
      delete permissions.allowDelete;

      if(field.permissions._lastPermissions == null || JSON.stringify(permissions) == JSON.stringify(field.permissions._lastPermissions))
      {
        field.permissions._lastPermissions = permissions;
        return;
      }
      field.permissions.allowCreate = permissions.allowCreate;
      field.permissions.allowEdit = permissions.allowEdit;
      field.permissions.allowRead = permissions.allowRead;

      ColumnsService.commit(self.view);
    }

    /**
     * Add new role
     * @param roleName
     * @returns {*}
     */
    function templateRoleAdd (roleName){
      return SecurityService.postRole({Name: roleName, Description: roleName}).then(loadView);
    }

    function  templateRoleRename(roleName, newName) {
      return SecurityService.updateRole({Name: newName, Description: newName}, roleName).then(loadView);
    }

    function templateRoleRemove(roleName){
      return SecurityService.deleteRole(roleName).then(loadView);
    }

    /**
     * Rebuild the UI for the roles value for object and fields
     */
    function rebuildTemplate(){

      self.view.permissions.securityWorkspace = Number(self.currentST);
      buildTemplate(self.view.permissions).then(function (data) {
        self.sTemplate = data;
      });

      self.fields = self.view.fields;
      self.fields.forEach(function(field){
        buildTemplate(field.permissions).then(function (data) {
          field.sTemplate = data;
        });
      });
    }


    $scope.$watch(function () { return self.currentST }, function (newVal, oldValue) {
      if (newVal != null && oldValue != null && newVal !== oldValue)
      {
        rebuildTemplate();
      }
    });

    function buildTemplate(inputPermissions) {
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

        permissions.allowCreate = inputPermissions.allowCreate;
        permissions.allowEdit = inputPermissions.allowEdit;
        permissions.allowDelete = inputPermissions.allowDelete;
        permissions.allowRead = inputPermissions.allowRead;
        inputPermissions._lastPermissions = permissions;
      }
      //if no, read the permissions from the User
      return SecurityMatrixService.loadMatrix(permissions);
    }

    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }

    function checkOverrideChange(scope) {
      if (self.view != null) {
        return self.view.permissions.overrideinheritable;
      }
    }

    function onOverrideChange(newVal, oldVal) {
      if (oldVal !== undefined) {
        ColumnsService.commit(self.view);
        rebuildTemplate();
      }
    }

  }

}());
