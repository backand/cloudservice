(function () {
  /**
   * render a table for user permissions management
   * @param ConfirmationPopup
   * @returns {{restrict: string, scope: {template: string, override: string}, templateUrl: string, link: Function}}
   * @constructor
   */
  function SecurityMatrixDirective(ConfirmationPopup, $rootScope, $log) {
    return {
      restrict: 'E',
      scope: {
        securityTemplate: '=',
        override: '=',
        onUpdate: '&'
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
        scope.removeRole = function (role) {

          ConfirmationPopup.confirm('Are sure you want to remove this rule?', 'Remove')
            .then(function (value) {
              if (value) {
                scope.template.splice(scope.template.indexOf(role), 1)
              }
            })
        };

        /**
         * push a new role to the template
         */
        scope.addRole = function () {

          var role = {
            title: "New Role...",
            permissions: {
              read: false,
              write: false,
              edit: false,
              delete: false
            }
          };

          scope.template.push(role);

        };
      }
    }
  }

  angular.module('app')
    .directive('securityMatrix', ['ConfirmationPopup','$rootScope','$log', SecurityMatrixDirective]);
}());
