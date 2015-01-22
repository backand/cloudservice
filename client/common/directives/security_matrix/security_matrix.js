(function () {
  /**
   * render a table for user permissions management
   * @param ConfirmationPopup
   * @returns {{restrict: string, scope: {template: string, override: string}, templateUrl: string, link: Function}}
   * @constructor
   */
  function SecurityMatrixDirective(ConfirmationPopup, $modal, $log, $filter) {
    return {
      restrict: 'E',
      scope: {
        securityTemplate: '=',
        override: '=',
        onUpdate: '&',
        onRoleAdd: '&',
        onRoleRename: '&',
        onRoleRemove: '&'
      },
      templateUrl: 'common/directives/security_matrix/security_matrix.html',

      link: function securityMatrixLink(scope) {

        /**
         * register a watcher on the template object
         */
        scope.$watch('securityTemplate', function (template, oldTemplate) {
          //$log.debug('template have been changed: ', template)
          if(template != null && oldTemplate != null && template != oldTemplate)
          {
            scope.onUpdate({template: template});
          }
        }, true);


        /**
         * locate and remove the given role from the template
         * @param role
         */


        scope.modal = {
          title: '',
          okButtonText: '',
          cancelButtonText: 'Cancel',
          deleteButtonText: 'Remove',
          roleName: ''
        };
        /**
         * push a new role to the template
         */
        scope.OpenRole = function (roleName, mode) {

          scope.modal.mode = mode;
          scope.modal.roleName = roleName;
          scope.modal._id = roleName;

          switch (scope.modal.mode) {
            case 'new':
              scope.modal.okButtonText = 'Add';
              scope.modal.title = 'Add New Role';
              break;
            case 'update':
              scope.modal.okButtonText = 'Rename';
              scope.modal.title = 'Rename Role';
              break;
          }

          var modalInstance = $modal.open({
            templateUrl: 'common/directives/security_matrix/security_new_role.html',
            backdrop: 'static',
            scope: scope
          });


          scope.modal.cancel= function () {
            modalInstance.close();
          }

          scope.modal.closeModal = function () {
            switch (scope.modal.mode) {
              case 'new':
                scope.onRoleAdd({role: scope.modal.roleName}).then(addRole,errorHandler);
                break;
              case 'update':
                scope.onRoleRename({role: scope.modal._id, newRole: scope.modal.roleName}).then(renameRole,errorHandler);
                break;

            }

          };

          scope.modal.removeRole = function () {
            ConfirmationPopup.confirm('Are sure you want to remove this rule?', 'Remove')
              .then(function (value) {
                if (value) {
                  scope.onRoleRemove({role: scope.modal._id}).then(removeRole,errorHandler)
                }
              })
          };

          function removeRole(){
            modalInstance.close();
            //find the role
            var currentRole = $filter('filter')(scope.securityTemplate, function (r) {
              return r.title === scope.modal._id;
            })[0];
            scope.securityTemplate.splice(scope.securityTemplate.indexOf(currentRole), 1)
          }

          function renameRole(){
            modalInstance.close();
            //find the role
            var currentRole = $filter('filter')(scope.securityTemplate, function (r) {
              return r.title === scope.modal._id;
            })[0];
            currentRole.title = scope.modal.roleName;
          }

          function addRole(){
            modalInstance.close();
            var newRole = {
              title: scope.modal.roleName,
              permissions: {
                read: false,
                write: false,
                edit: false,
                delete: false
              }
            };

            scope.securityTemplate.push(newRole);
          }

          /**
           * delegate errors to the notification service
           * @param error
           * @param message
           */
          function errorHandler(error, message) {
            //modalInstance.close();
            //NotificationService.add('error', message);
          }

        };

      }
    }
  }

  angular.module('app')
    .directive('securityMatrix', ['ConfirmationPopup','$modal','$log','$filter', SecurityMatrixDirective]);
}());
