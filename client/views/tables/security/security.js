(function () {

  function SecurityController($scope, $state, $filter, SecurityMatrixService, NotificationService, SecurityService, ColumnsService, DictionaryService) {

    var self = this;

    (function init() {
      self.placeHolder = "'{{sys::username}}' = ProjectUserEmail"
      self._lastPermissions = null;
      self.workspaces = null;
      self.view = null;

      //Security Matrix
      self.templateChanged = templateChanged;
      self.templateRoleAdd = templateRoleAdd;
      self.templateRoleRename = templateRoleRename;
      self.templateRoleRemove = templateRoleRemove;
      $scope.$on('tabs:security', getWorkspaces);

      //Dictionary
      self.dictionaryItems = {};
      self.dictionaryState = false;
      self.toggleOptions = toggleDictionary;
      self.insertAtChar= insertTokenAtChar;
    }());

    /**
     * switch the state of the dictionary window
     */
    function toggleDictionary() {
      self.dictionaryState = !self.dictionaryState;
      $scope.$broadcast('insert:windowClosed');
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
      $scope.$parent.$broadcast('insert:placeAtCaret', [elementId, token]);
    }

    /**
     * Read the list of workspaces
     */
    function getWorkspaces() {
      DictionaryService.get().then(populateDictionaryItems);

      if (self.workspaces == null) {
        SecurityService.appName =
          SecurityService.getWorkspace().then(worksapceSuccessHandler, errorHandler)
      }
    }

    /**
     * @param data
     * @constructor
     */
    function worksapceSuccessHandler(data) {
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



    $scope.$watch('security.currentST', function (newVal, oldValue) {
      if (newVal != null && oldValue != null && newVal !== oldValue)
      {
        self.view.permissions.securityWorkspace = Number(self.currentST);
        buildTemplate();
      }
    });

    function buildTemplate() {
      self.sTemplate = [];
      var permissions = {};
      self.appName = SecurityMatrixService.appName = $state.params.name;

      //check if override is on - if yes read the permissions from the workspace (security group)
      //self.view.override
      if (!self.view.permissions.overrideinheritable) {
        //read the permission from the workspace
        var ws = $filter('filter')(self.workspaces, function (f) {
          return f.__metadata.id == String(self.view.permissions.securityWorkspace);
        });

        if (!ws) {
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

  angular.module('app')
    .controller('SecurityController', ['$scope', '$state', '$filter', 'SecurityMatrixService', 'NotificationService', 'SecurityService', 'ColumnsService','DictionaryService', SecurityController]);
}());
