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
        icon: 'assets/images/platforms/logo-small.png',
        iconClass: 'platform-sprite-icon rest-api-logo-small'
      }, {
        platform: 'AngularJS',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite angular-logo-large',
        icon: 'assets/images/platforms/logo-small.png',
        iconClass: 'platform-sprite-icon angular-logo-small'
      }, {
        platform: 'Angular 2',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite angular-2-logo-large',
        icon: 'assets/images/platforms/logo-small.png',
        iconClass: 'platform-sprite-icon angular-2-logo-small'
      }, {
        platform: 'Ionic',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite ionic-logo-large',
        icon: 'assets/images/platforms/logo-small.png',
        iconClass: 'platform-sprite-icon ionic-logo-small'
      }, {
        platform: 'Ionic 2',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite ionic-2-logo-large',
        icon: 'assets/images/platforms/logo-small.png',
        iconClass: 'platform-sprite-icon ionic-2-logo-small'
      }, {
        platform: 'React',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite react-logo-large',
        icon: 'assets/images/platforms/logo-small.png',
        iconClass: 'platform-sprite-icon react-logo-small'
      }, {
        platform: 'React Native',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite react-native-logo-large',
        icon: 'assets/images/platforms/logo-small.png',
        iconClass: 'platform-sprite-icon react-native-logo-small'
      }/*, {
        platform: 'Redux',
        image: 'assets/images/platforms/logo-large.png',
        class: 'platform-sprite react-logo-large',
        icon: 'assets/images/platforms/icons/angular_icon.png',
        iconClass: 'platform-sprite-icon react-logo-small'
      }*/];
    };
  }

})();
