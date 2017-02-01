(function () {
  'use strict';

  angular.module('common.services')
    .service('PlatformsService', ['$http', 'CONSTS', PlatformsService]);

  function PlatformsService($http, CONSTS) {

    var self = this;

    self.get = function () {
      return [
        {
          platform: 'Angular 1',
          image: 'assets/images/platforms/logo-large.png',
          class: 'platform-sprite angular-logo-large',
          icon: 'assets/images/platforms/logo-small.png',
          iconClass: 'platform-sprite-icon angular-logo-small',
          starterAppId: 'ng1'
        }, {
          platform: 'Angular 2',
          image: 'assets/images/platforms/logo-large.png',
          class: 'platform-sprite angular-2-logo-large',
          icon: 'assets/images/platforms/logo-small.png',
          iconClass: 'platform-sprite-icon angular-2-logo-small',
          starterAppId: 'ng2'
        }, {
          platform: 'Ionic 1',
          image: 'assets/images/platforms/logo-large.png',
          class: 'platform-sprite ionic-logo-large',
          icon: 'assets/images/platforms/logo-small.png',
          iconClass: 'platform-sprite-icon ionic-logo-small',
          starterAppId: 'ionic1'
        }, {
          platform: 'Ionic 2',
          image: 'assets/images/platforms/logo-large.png',
          class: 'platform-sprite ionic-2-logo-large',
          icon: 'assets/images/platforms/logo-small.png',
          iconClass: 'platform-sprite-icon ionic-2-logo-small',
          starterAppId: 'ionic2'
        }, {
          platform: 'Redux',
          image: 'assets/images/platforms/logo-large.png',
          class: 'platform-sprite react-logo-large',
          icon: 'assets/images/platforms/logo-small.png',
          iconClass: 'platform-sprite-icon react-logo-small',
          starterAppId: 'redux'
        }, {
          platform: 'React Native',
          image: 'assets/images/platforms/logo-large.png',
          class: 'platform-sprite react-native-logo-large',
          icon: 'assets/images/platforms/logo-small.png',
          iconClass: 'platform-sprite-icon react-native-logo-small',
          starterAppId: 'reactNative'
        }
      ];
    };
  }

})();
