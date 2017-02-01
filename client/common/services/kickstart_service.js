(function () {
  'use strict';

  angular.module('common.services')
    .service('KickstartService', ['CONSTS', KickstartService]);

  function KickstartService(CONSTS) {

    var self = this;

    self.getPlatformContent = function (platformName) {
      var optionsHash = {};
      optionsHash[ 'ng1Kickstart' ] = "views/docs/kickstarts/templates/ng1.html";
      optionsHash[ 'ng1Existing' ] = "views/docs/kickstarts/templates/ng1Existing.html";
      optionsHash[ 'ng2Kickstart' ] = "views/docs/kickstarts/templates/ng2.html";
      optionsHash[ 'ng2Existing' ] = "views/docs/kickstarts/templates/ng2Existing.html";
      optionsHash[ 'ionic1Kickstart' ] = "views/docs/kickstarts/templates/ionic1.html";
      optionsHash[ 'ionic1Existing' ] = "views/docs/kickstarts/templates/ionic1Existing.html";
      optionsHash[ 'ionic2Kickstart' ] = "views/docs/kickstarts/templates/ionic2.html";
      optionsHash[ 'ionic2Existing' ] = "views/docs/kickstarts/templates/ionic2Existing.html";
      optionsHash[ 'reduxKickstart' ] = "views/docs/kickstarts/templates/redux.html";
      optionsHash[ 'reduxExisting' ] = "views/docs/kickstarts/templates/reduxExisting.html";
      optionsHash[ 'reactNativeKickstart' ] = "views/docs/kickstarts/templates/reactNative.html";
      optionsHash[ 'reactNativeExisting' ] = "views/docs/kickstarts/templates/reactNativeExisting.html";

      return optionsHash[platformName];
    };
  }

})();
