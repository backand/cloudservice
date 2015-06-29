(function() {
  'use strict';

  var terminology = {
    table: 'object',
    column: 'field'
  };

  function newTerminology() {
    return function(text) {
      _.forIn(terminology, function (value, key) {
        text = text.replace(new RegExp(key, 'gi'), value);
      });
      return text;
    };
  }

  angular.module('common.filters.newTerminology', [])
    .filter('newTerminology', newTerminology);
})();
