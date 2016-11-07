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
        helpUrl: 'socialAndKeysGithub',
        requireEmail: false,
        useForSignin: true
      },
      {
        name: 'google',
        label: 'Google',
        url: 'www.google.com',
        css: 'google-plus',
        id: 2,
        helpUrl: 'socialAndKeysGoogle',
        requireEmail: false,
        useForSignin: true
      },
      {
        name: 'facebook',
        label: 'Facebook',
        url: 'www.facebook.com',
        css: 'facebook',
        id: 3,
        helpUrl: 'socialAndKeysFacebook',
        clientIdTitle: 'App ID',
        secretIdTitle: 'App Secret',
        requireEmail: false,
        useForSignin: true
      },
      {
        name: 'twitter',
        label: 'Twitter',
        url: 'www.twitter.com',
        css: 'twitter',
        id: 4,
        helpUrl: 'socialAndKeysTwitter',
        requireEmail: true,
        clientIdTitle: 'Consumer Key (API Key)',
        secretIdTitle: 'Consumer Secret (API Secret)',
        useForSignin: true
      },
      {
        name: 'azureAd',
        label: 'Azure AD',
        url: 'www.backand.com',
        css: 'windows',
        id: 5,
        helpUrl: 'socialAndKeysAzure',
        requireEmail: false,
        clientIdTitle: 'Client Id (Application Id)',
        secretIdTitle: 'OAUTH 2.0 Endpoint (https://login.windows.net/{}/oauth2)',
        useForSignin: false
      },
      {
        name: 'adfs',
        label: 'ADFS',
        url: 'www.backand.com',
        css: 'windows',
        id: 6,
        helpUrl: 'socialAndKeysADFS',
        requireEmail: false,
        clientIdTitle: 'Client Id',
        secretIdTitle: 'Redirect Uri (/adfs/oauth2)',
        useForSignin: false
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
