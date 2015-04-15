(function() {
    'use strict';

    angular.module('backand.backoffice', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('backoffice.edit', {
                url: '/template',
                controller: 'BackofficeTemplate as backT',
                templateUrl: 'views/backoffice/template.html'
            })
            .state('backoffice.cust', {
                url: '/customization',
                templateUrl: 'views/backoffice/customize.html'
            })
            .state('backoffice.code', {
                url: '/code',
                templateUrl: 'views/backoffice/code.html'
            })
    }
})();
