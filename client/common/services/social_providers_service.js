(function() {
  'use strict';

  function SocialProvidersService(CONSTS, $http, $q) {

    var self = this;

    function init() {
      self.socialProviders = [];
      self.getSocialProviders()
        .then(function (response) {
          angular.copy(response, self.socialProviders);
        })
    }

    var socialProviders = [
      {
        name: 'github',
        label: 'GitHub',
        url: 'www.github.com',
        css: 'github',
        id: 1,
        helpUrl: "socialAndKeysGithub"
      },
      {
        name: 'google',
        label: 'Google',
        url: 'www.google.com',
        css: 'google-plus',
        id: 2,
        helpUrl: "socialAndKeysGoogle"
      },
      {
        name: 'facebook',
        label: 'Facebook',
        url: 'www.facebook.com',
        css: 'facebook',
        id: 3,
        helpUrl: "socialAndKeysFacebook",
        clientIdTitle: 'App ID',
        secretIdTitle: 'App Secret'
      }
    ];

    self.getSocialProviders = function () {
      return $q.when(socialProviders);
    };

    init();


  }

  angular.module('common.services')
    .service('SocialProvidersService',['CONSTS', '$http', '$q', SocialProvidersService]);

})();
