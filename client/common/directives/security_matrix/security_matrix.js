(function () {

  function SecurityMatrixDirective() {
    return {
      restrict: 'E',
      scope: {
        template: '=',
        override: '='
      },
      templateUrl: 'common/directives/security_matrix/security_matrix.html',
      link: securityMatrixLink
    }
  }


  function securityMatrixLink($scope) {

    $scope.removeRole = function (role) {
      var result = window.confirm('Remove this role?');
      if (result) {
        $scope.template.splice($scope.template.indexOf(role), 1)
      }
    };



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
      //$scope.override = true;
    };

  }

  angular.module('app')
    .directive('securityMatrix', SecurityMatrixDirective)
}());
