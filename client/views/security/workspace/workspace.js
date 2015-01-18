/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityWorkspace($modal, $stateParams, SecurityService, ColumnsService, SecurityMatrixService, NotificationService, $scope) {

    var self = this;
    self.appName = SecurityMatrixService.appName = SecurityService.appName = $stateParams.name;

    self.workspaces = null;
    getWorkspaces();
    $scope.savews = function (){
      var role = $('div.workspace ul li.active').attr('id');
      var wsName=$('div.workspace ul li.active').attr('heading');
      var ws = {
        __metadata: {id: String(role)},
         workspaceName: wsName
      }

      var permissions = SecurityMatrixService.getPermission(self.workspaces[2].template);
      ws = angular.extend(ws,permissions);
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
    $scope.active = function() {
      return $scope.tabs.filter(function(pane){
        return pane.active;
      })[0];
    };
   /* self.getTemplate = function (workspace) {
      var template = [];
      SecurityMatrixService.loadMatrix(template, workspace, errorHandler);
      return template;
    }*/
    function WorksapceSuccessHandler(data) {
      self.workspaces = data.data.data;
      angular.forEach(self.workspaces, function (workspace) {
        workspace.template=[];
        SecurityMatrixService.loadMatrix(workspace.template, workspace, errorHandler);
      });
    }

    //todo: (yariv)
    $scope.$watch('workspaces.workspaces', function (aaa){
      var b=1;
    }, true);

    /* function buildTemplate() {
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

     permissions.allowCreate = self.view.permissions.allowCreate;
     permissions.allowEdit = self.view.permissions.allowEdit;
     permissions.allowDelete = self.view.permissions.allowDelete;
     permissions.allowRead = self.view.permissions.allowRead;

     }
     //if no, read the permissions from the User
     if (self.sTemplate.length == 0)
     SecurityMatrixService.loadMatrix(self.sTemplate, permissions, errorHandler);


     }*/

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
