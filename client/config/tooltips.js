(function() {
  'use strict';

  angular.module('app')
    .config(['$translateProvider', function ($translateProvider) {

      var tooltips = {
        'TITLE': 'this is a title',
        'FOO': 'this is a foo',
        'NEST': {
          'FOO': 'this is nested foo'
        }
      };

      $translateProvider
        .translations('en', tooltips)
        .preferredLanguage('en');

    }]);
}());
