(function () {
  'use strict';

  angular.module('common.services')
    .service('KickstartService', ['$http', 'CONSTS', KickstartService]);

  function KickstartService($http, CONSTS) {

    var self = this;

    self.getPlatformContent = function (platformName) {
      var optionsHash = {};
      optionsHash[ 'restExisting' ] = "docs/kickstarts/templates/restExisting.html";
      optionsHash[ 'restKickstart' ] = "docs/kickstarts/templates/rest.html";
      optionsHash[ 'ng1Existing' ] = "docs/kickstarts/templates/ng1Existing.html";
      optionsHash[ 'ng1Kickstart' ] = "docs/kickstarts/templates/ng1.html";
      optionsHash[ 'ng1Todo' ] = "docs/kickstarts/templates/ng1Todo.html";
      optionsHash[ 'ng1Crud' ] = "docs/kickstarts/templates/ng1Crud.html";
      optionsHash[ 'ng1Payments' ] = "docs/kickstarts/templates/ng1Payments.html";
      optionsHash[ 'ng2Existing' ] = "docs/kickstarts/templates/ng2Existing.html";
      optionsHash[ 'ng2Kickstart' ] = "docs/kickstarts/templates/ng2.html";
      optionsHash[ 'ng2Users' ] = "docs/kickstarts/templates/ng2Users.html";
      optionsHash[ 'ng2UsersCrud' ] = "docs/kickstarts/templates/ng2UsersCrud.html";
      optionsHash[ 'ionicExisting' ] = "docs/kickstarts/templates/ionicExisting.html";
      optionsHash[ 'ionicKickstart' ] = "docs/kickstarts/templates/ionic.html";
      optionsHash[ 'ionicStarterSocial' ] = "docs/kickstarts/templates/ionicStarterSocial.html";
      optionsHash[ 'ionicChat' ] = "docs/kickstarts/templates/ionicChat.html";
      optionsHash[ 'ionic2Existing' ] = "docs/kickstarts/templates/ionic2Existing.html";
      optionsHash[ 'ionic2Kickstart' ] = "docs/kickstarts/templates/ionic2.html";
      optionsHash[ 'ionic2ToDo' ] = "docs/kickstarts/templates/ionic2ToDo.html";
      optionsHash[ 'reactExisting' ] = "docs/kickstarts/templates/reactExisting.html";
      optionsHash[ 'reactKickstart' ] = "docs/kickstarts/templates/react.html";
      optionsHash[ 'reactNativeExisting' ] = "docs/kickstarts/templates/reactNativeExisting.html";
      optionsHash[ 'reactNativeKickstart' ] = "docs/kickstarts/templates/reactNative.html";

      return optionsHash[platformName];
    };
  }

})();
