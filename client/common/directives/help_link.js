(function() {
  'use strict';

  function baHelpLink() {
    return {
      restrict: 'E',
      scope: {
        key: '@',
        target: '@?'
      },
      controller: function ($scope) {
        $scope.target = $scope.target || 'bkhelp';

        var locations = {
          "securityGeneral": {
            "page": "security/auth",
            "url": "http://docs.backand.com/en/latest/apidocs/security/index.html#introduction"
          },
          "securityAnonymousAccess": {
            "page": "security/auth",
            "section": "Anonymous Access",
            "url": "http://docs.backand.com/en/latest/apidocs/security/index.html#anonymous-access"
          },
          "securitySignup": {
            "page": "security/auth",
            "section": "Public App",
            "url": "http://docs.backand.com/en/latest/apidocs/security/index.html#sign-up"
          },
          "emailVerification":{
            "page":"security/auth",
            "section": "Sign-up Email Verification",
            "url":"http://docs.backand.com/en/latest/getting_started/security_auth/index.html#sign-up-email-verification"
          },
          "socialAndKeysGeneral": {
            "page": "security/social_and_keys",
            "url": "http://docs.backand.com/en/latest/getting_started/security_auth/index.html#social-keys"
          },
          "socialAndKeysMasterToken": {
            "page": "security/social_and_keys",
            "section": "Master Token",
            "url": "http://docs.backand.com/en/latest/getting_started/security_auth/index.html#master-token"
          },
          "socialAndKeysAPISignupToken": {
            "page": "security/social_and_keys",
            "section": "API Sign-up Token",
            "url": "http://docs.backand.com/en/latest/getting_started/security_auth/index.html#api-signup-token"
          },
          "objectsModel": {
            "page": "objects/model",
            "url": "http://docs.backand.com/en/latest/apidocs/security/index.html#introduction"
          },
          "preDefinedFilter":{
            "page":"objects/security",
            "url":"http://docs.backand.com/en/latest/getting_started/objects/index.html#pre-defined-filter"
          }
        }

        $scope.location = locations[$scope.key].url || 'http://docs.backand.com';

      },
      template: '<a href="{{location}}" target="{{target}}" style="text-decoration: none;margin-left: 5px;"><i class="ti-help-alt"></i></a>'
    };
  }

  angular.module('common.directives')
    .directive('baHelpLink', [baHelpLink]);
})();
