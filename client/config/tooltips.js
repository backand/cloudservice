(function() {
  'use strict';

  angular.module('backand')
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
