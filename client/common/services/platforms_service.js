(function () {
  'use strict';

  angular.module('common.services')
    .service('PlatformsService', ['$http', 'CONSTS', PlatformsService]);

  function PlatformsService($http, CONSTS) {

    var self = this;

    self.get = function () {
      return [{
        platform: 'AngularJS',
        image: 'assets/images/angular.png'
      }, {
        platform: 'React',
        image: 'assets/images/react.png'
      }];
    };
  }

})();
