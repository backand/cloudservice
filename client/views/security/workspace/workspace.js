/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityWorkspace($modal, $stateParams, SecurityService, ColumnsService, SecurityMatrixService, NotificationService, $scope) {

    var self = this;
    self.appName = SecurityMatrixService.appName = SecurityService.appName = $stateParams.name;

    self.workspaces = null;
    getWorkspaces();
    $scope.savews = function () {
      var role = $('div.workspace ul li.active').attr('id');
      var wsName = $('div.workspace ul li.active').attr('heading');
      var ws = {
        __metadata: {id: String(role)},
        workspaceName: wsName
      }

      var permissions = SecurityMatrixService.getPermission(self.workspaces[2].template);
      ws = angular.extend(ws, permissions);
      SecurityService.updateWorkspace(ws);
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
        workspace.template = [];
        SecurityMatrixService.loadMatrix(workspace).then(function (data) {
          workspace.template = data;
        });
      });
    }

    $scope.$watch('workspaces.workspaces', function (newVal, oldValue) {
      if (newVal != null && newVal !== oldValue)
        var a = 1;
    }, true);


    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }
  }

  angular.module('app')
    .controller('SecurityWorkspace', [
      '$modal',
      '$stateParams',
      'SecurityService',
      'ColumnsService',
      'SecurityMatrixService',
      'NotificationService',
      '$scope',
      SecurityWorkspace
    ]);

}());
