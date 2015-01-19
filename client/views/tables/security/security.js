(function () {

  function SecurityController($scope, $state, $filter, SecurityMatrixService, NotificationService, SecurityService, ColumnsService) {

    var self = this;

    self.workspaces = null;

    (function init() {
      self.view = null;
      self.templateChanged = templateChanged;
      $scope.$on('tabs:security', getWorkspaces);
    }());

    //todo: (yariv): save the template to the server
    function templateChanged (template) {
      console.log('callback function, template changed: ', template);
      var p = SecurityMatrixService.getPermission(self.sTemplate);
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
      buildTemplate();
    }

    $scope.$watch('security.view.permissions.securityWorkspace', function (newVal, oldValue) {
      if (newVal != null && oldValue != null && newVal !== oldValue)
        buildTemplate();
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

        permissions.allowCreate = self.view.permissions.allowCreate;
        permissions.allowEdit = self.view.permissions.allowEdit;
        permissions.allowDelete = self.view.permissions.allowDelete;
        permissions.allowRead = self.view.permissions.allowRead;

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
