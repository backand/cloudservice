(function () {
  'use strict';

  angular.module('common.services')
    .service('PlatformsService', ['$http', 'CONSTS', PlatformsService]);

  function PlatformsService($http, CONSTS) {

    var self = this;

    self.get = function () {
      return [{
        platform: 'RESTful API',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite rest-api-logo-large',
        icon: 'assets/images/platforms/icons/angular_icon.png'
      }, {
        platform: 'AngularJS',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite angular-logo-large',
        icon: 'assets/images/platforms/icons/angular_icon.png'
      }, {
        platform: 'Angular 2',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite angular-2-logo-large',
        icon: 'assets/images/platforms/icons/angular_icon.png'
      }, {
        platform: 'Ionic',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite ionic-logo-large',
        icon: 'assets/images/platforms/icons/angular_icon.png'
      }, {
        platform: 'Ionic 2',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite ionic-2-logo-large',
        icon: 'assets/images/platforms/icons/angular_icon.png'
      }, {
        platform: 'React',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite react-logo-large',
        icon: 'assets/images/platforms/icons/angular_icon.png'
      }, {
        platform: 'React Native',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite react-native-logo-large',
        icon: 'assets/images/platforms/icons/angular_icon.png'
      }/*, {
        platform: 'Redux',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite react-logo-large',
        icon: 'assets/images/platforms/icons/angular_icon.png'
      }*/];
    };
  }

})();
