/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityWorkspace($stateParams, SecurityService, SecurityMatrixService, NotificationService, $scope) {

    var self = this;
    /**
     * Init the workspaces = security templates page
     */
    (function init() {
      self.appName = SecurityMatrixService.appName = SecurityService.appName = $stateParams.name;
      self.workspaces = null;
      self.templateChanged = templateChanged;
      getWorkspaces();
    }());

    //todo: (yariv): save the template to the server
    function templateChanged (template,wsId) {
      if(template){
        console.log('callback function, template changed: ', template);
        //var p = SecurityMatrixService.getPermission(template);
      }
    }

    /**
     * Read the list of workspaces
     */
    function getWorkspaces() {
      if (self.workspaces == null) {
        SecurityService.getWorkspace().then(WorksapceSuccessHandler, errorHandler);
      }
    }


    $scope.addWorkspace = function () {
      var newWS ={

        allowCreate: "Developer,Admin,User",
          allowDelete: "Developer,Admin,User",
        allowEdit: "Developer,Admin,User",
        allowRead: "Developer,Admin,User,ReadOnly",
        overridepermissions: true,
        workspaceName: "New Workspace"
      };
      self.workspaces.push( newWS  );
      SecurityService.postWorkspace(newWS);
    }


    function WorksapceSuccessHandler(data) {
      self.workspaces = data.data.data;
      angular.forEach(self.workspaces, function (workspace) {
        var permissions = {};
        permissions.allowCreate = workspace.allowCreate;
        permissions.allowEdit = workspace.allowEdit;
        permissions.allowDelete =workspace.allowDelete;
        permissions.allowRead = workspace.allowRead;
        SecurityMatrixService.loadMatrix(permissions).then(function (data){
          workspace.template = data;
        })
      });
    }

    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }
  }

  angular.module('app')
    .controller('SecurityWorkspace', [
      '$stateParams',
      'SecurityService',
      'SecurityMatrixService',
      'NotificationService',
      '$scope',
      SecurityWorkspace
    ]);

}());
