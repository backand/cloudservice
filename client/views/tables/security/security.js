(function () {

  function SecurityController($scope, $state, $filter, SecurityMatrixService, NotificationService, SecurityService, ColumnsService) {

    var self = this;

    self.workspaces = null;

    (function init() {
      self.view = null;
      self.templateChanged = templateChanged;
      self.templateRoleAdd = templateRoleAdd;
      self.templateRoleRename = templateRoleRename;
      self.templateRoleRemove = templateRoleRemove;
      $scope.$on('tabs:security', getWorkspaces);
    }());

    //todo: (yariv): save the template to the server
    function templateChanged (template) {
      console.log('callback function, template changed: ', template);
      var p = SecurityMatrixService.getPermission(self.sTemplate);
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
    /**
     * Read the list of workspaces
     */
    function getWorkspaces() {
      if (self.workspaces == null) {
        SecurityService.appName =
          SecurityService.getWorkspace().then(WorksapceSuccessHandler, errorHandler)
      }
    }

    /**
     *
     * @param data
     * @constructor
     */
    function WorksapceSuccessHandler(data) {
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
    .controller('SecurityController', ['$scope', '$state', '$filter', 'SecurityMatrixService', 'NotificationService', 'SecurityService', 'ColumnsService', SecurityController]);
}());
