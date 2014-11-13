(function() {
  'use strict';

  angular.module('app.consts', [])
    .constant('BASE_URL', '@@apiUrl');

  alert('PRODUCTION @@apiUrl');
})();
