(function () {

    function SecurityMatrixDirective () {
        return {
            templateUrl: 'common/directives/security_matrix/security_matrix.html'
        }
    }

    angular.module('app')
        .directive('securityMatrix',SecurityMatrixDirective);
}());
