(function () {
  'use strict';

  angular.module('backand')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('json_model', {
        parent: 'tables.model',
        url: '/json',
        controller: 'JsonModelController as jsonModel',
        templateUrl: 'views/tables/model/json_model/json_model.html'
      })
      .state('erd_model', {
        parent: 'tables.model',
        url: '/erd',
        controller: 'JsonModelController as jsonModel',
        templateUrl: 'views/tables/model/json_model/json_model.html'
      })
  }
})();
