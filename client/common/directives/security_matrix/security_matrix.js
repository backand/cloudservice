(function () {

  function SecurityMatrixDirective(ConfirmationPopup) {
    return {
      restrict: 'E',
      scope: {
        template: '=',
        override: '='
      },
      templateUrl: 'common/directives/security_matrix/security_matrix.html',
      link: function securityMatrixLink($scope) {

        /**
         * locate and remove the given role from the template
         * @param role
         */
        $scope.removeRole = function (role) {

          ConfirmationPopup.confirm('Are sure you want to remove this rule?', 'Remove')
            .then(function(value){
            if (value) {
              $scope.template.splice($scope.template.indexOf(role), 1)
            }
          })
        };


        /**
         * push a new role to the template
         */
        $scope.addRole = function () {

          var role = {
            title: "New Role...",
            permissions: {
              read: false,
              write: false,
              edit: false,
              delete: false
            }
          };

          $scope.template.push(role);
        };
      }
    }
  }

  angular.module('app')
    .directive('securityMatrix',['ConfirmationPopup', SecurityMatrixDirective]);
}());
