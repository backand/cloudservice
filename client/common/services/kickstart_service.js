(function () {
  'use strict';

  angular.module('common.services')
    .service('KickstartService', ['CONSTS', KickstartService]);

  function KickstartService(CONSTS) {

    var self = this;

    self.getPlatformContent = function (platformName) {
      var optionsHash = {};
      optionsHash[ 'ng1_kickstart' ] = "views/docs/kickstarts/templates/ng1.html";
      optionsHash[ 'ng1_existing' ] = "views/docs/kickstarts/templates/ng1Existing.html";
      optionsHash[ 'ng2_kickstart' ] = "views/docs/kickstarts/templates/ng2.html";
      optionsHash[ 'ng2_existing' ] = "views/docs/kickstarts/templates/ng2Existing.html";
      optionsHash[ 'ionic1_kickstart' ] = "views/docs/kickstarts/templates/ionic1.html";
      optionsHash[ 'ionic1_existing' ] = "views/docs/kickstarts/templates/ionic1Existing.html";
      optionsHash[ 'ionic2_kickstart' ] = "views/docs/kickstarts/templates/ionic2.html";
      optionsHash[ 'ionic2_existing' ] = "views/docs/kickstarts/templates/ionic2Existing.html";
      optionsHash[ 'redux_kickstart' ] = "views/docs/kickstarts/templates/redux.html";
      optionsHash[ 'redux_existing' ] = "views/docs/kickstarts/templates/reduxExisting.html";
      optionsHash[ 'reactNative_kickstart' ] = "views/docs/kickstarts/templates/reactNative.html";
      optionsHash[ 'reactNative_existing' ] = "views/docs/kickstarts/templates/reactNativeExisting.html";

      return optionsHash[platformName];
    };
  }

})();
