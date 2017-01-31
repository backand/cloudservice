(function () {
  'use strict';

  angular.module('common.services')
    .service('KickstartService', ['$http', 'CONSTS', KickstartService]);

  function KickstartService($http, CONSTS) {

    var self = this;

    self.getPlatformContent = function (platformName) {
      var optionsHash = {};
      optionsHash[ 'restExisting' ] = "";
      optionsHash[ 'restKickstart' ] = "";
      optionsHash[ 'ng1Existing' ] = "";
      optionsHash[ 'ng1Kickstart' ] = "docs/kickstarts/templates/ng1.html";
      optionsHash[ 'ng1Todo' ] = "";
      optionsHash[ 'ng1Crud' ] = "";
      optionsHash[ 'ng1Payments' ] = "";
      optionsHash[ 'ng2Existing' ] = "";
      optionsHash[ 'ng2Kickstart' ] = "docs/kickstarts/templates/ng2.html";
      optionsHash[ 'ng2Users' ] = "";
      optionsHash[ 'ng2UsersCrud' ] = "";
      optionsHash[ 'ionicExisting' ] = "";
      optionsHash[ 'ionicKickstart' ] = "docs/kickstarts/templates/ionic1.html";
      optionsHash[ 'ionicStarterSocial' ] = "";
      optionsHash[ 'ionicChat' ] = "";
      optionsHash[ 'ionic2Existing' ] = "";
      optionsHash[ 'ionic2Kickstart' ] = "docs/kickstarts/templates/ionic2.html";
      optionsHash[ 'ionic2ToDo' ] = "";
      optionsHash[ 'reactExisting' ] = "";
      optionsHash[ 'reactKickstart' ] = "";
      optionsHash[ 'reactNativeExisting' ] = "";
      optionsHash[ 'reactNativeKickstart' ] = "";

      return optionsHash[platformName];
    };
  }

})();
