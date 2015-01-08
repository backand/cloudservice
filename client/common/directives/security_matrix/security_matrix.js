(function () {

    function SecurityMatrixDirective () {
        return {
            templateUrl: 'security_matrix.html'
        }
    }

    angular.module('')
        .directive('SecurityMatrix',SecurityMatrixDirective);
}());
