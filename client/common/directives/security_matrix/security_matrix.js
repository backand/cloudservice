(function () {

    function SecurityMatrixDirective () {
        return {
            restrict: 'E',
            scope : {
              template: '=securityTemplate',
              override : '='
            },
            templateUrl: 'common/directives/security_matrix/security_matrix.html'
        }
    }

    angular.module('app')
        .directive('securityMatrix',SecurityMatrixDirective);

}());
