(function () {
  'use strict';

  angular.module('common.services')
    .service('PlatformsService', ['CONSTS', PlatformsService]);

  function PlatformsService(CONSTS) {

    var self = this;

    self.get = function () {
      return [
        {
          platform: 'Angular 1',
          class: 'platform-sprite angular-logo-large',
          iconClass: 'platform-sprite-icon angular-logo-small',
          starterAppId: 'ng1'
        },
        {
          platform: 'Angular 2',
          class: 'platform-sprite angular-2-logo-large',
          iconClass: 'platform-sprite-icon angular-2-logo-small',
          starterAppId: 'ng2'
        }, {
          platform: 'Ionic 1',
          class: 'platform-sprite ionic-logo-large',
          iconClass: 'platform-sprite-icon ionic-logo-small',
          starterAppId: 'ionic1'
        },
        {
          platform: 'Ionic 2',
          class: 'platform-sprite ionic-2-logo-large',
          iconClass: 'platform-sprite-icon ionic-2-logo-small',
          starterAppId: 'ionic2'
        }, {
          platform: 'React / Redux',
          class: 'platform-sprite react-logo-large',
          iconClass: 'platform-sprite-icon react-logo-small',
          starterAppId: 'redux'
        },
        {
          platform: 'React Native',
          class: 'platform-sprite react-native-logo-large',
          iconClass: 'platform-sprite-icon react-native-logo-small',
          starterAppId: 'reactNative'
        }
      ];
    };
  }

})();
