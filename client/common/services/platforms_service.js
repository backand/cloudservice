(function () {
  'use strict';

  angular.module('common.services')
    .service('PlatformsService', ['$http', 'CONSTS', PlatformsService]);

  function PlatformsService($http, CONSTS) {

    var self = this;

    self.get = function () {
      return [{
        platform: 'iOS',
        image: 'assets/images/platforms/ios.png'
      },{
        platform: 'AngularJS',
        image: 'assets/images/platforms/angular.png'
      },{
        platform: 'Ionic',
        image: 'assets/images/platforms/ionic.png'
      }, {
        platform: 'React',
        image: 'assets/images/platforms/react.png'
      },{
        platform: 'Android',
        image: 'assets/images/platforms/android.png'
      },{
        platform: 'Angular 2',
        image: 'assets/images/platforms/angular2.png'
      },{
        platform: 'Ionic 2',
        image: 'assets/images/platforms/ionic2.png'
      },{
        platform: 'RESTful API',
        image: 'assets/images/platforms/rest.png'
      }];
    };
  }

})();
