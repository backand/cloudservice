(function() {
    'use strict';

    angular.module('app.backoffice', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('backoffice.edit', {
                parent: 'backoffice',
                url: '/template/:name',
                controller: 'BackofficeTemplate as backT',
                templateUrl: 'views/backoffice/template.html'
            })
            .state('backoffice.cust', {
                parent: 'backoffice',
                url: '/customization/:name',
                controller: 'BackofficeCust as cust',
                templateUrl: 'views/backoffice/customize.html'
            })
            .state('backoffice.code', {
                parent: 'backoffice',
                url: '/code/:name',
                templateUrl: 'views/backoffice/code.html'
            })
    }
})();