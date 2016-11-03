(function() {
  'use strict';

  function baHelpLink() {
    return {
      restrict: 'E',
      scope: {
        key: '@',
        withText: '@?',
        target: '@?'
      },
      controller: function ($scope) {
        $scope.target = $scope.target || 'bkhelp';
        $scope.withText = $scope.withText || true;

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
          "customPages":{
            "page":"security/auth",
            "section":"Custom Registration Page URL",
            "url":"http://docs.backand.com/en/latest/getting_started/security_auth/index.html#custom-pages"
          },
          "emailVerification":{
            "page":"security/auth",
            "section": "Sign-up Email Verification",
            "url":"http://docs.backand.com/en/latest/getting_started/security_auth/index.html#sign-up-email-verification"
          },
          "socialAndKeysGeneral": {
            "page": "security/social_and_keys",
            "url": "http://docs.backand.com/en/latest/getting_started/security_auth/index.html#social-configuration"
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
          "socialAndKeysFacebook": {
            "page": "security/social_and_keys",
            "section": "Facebook",
            "url": "http://docs.backand.com/en/latest/getting_started/security_auth/index.html#facebook-app-configuration"
          },
          "socialAndKeysTwitter": {
            "page": "security/social_and_keys",
            "section": "Twitter",
            "url": "http://docs.backand.com/en/latest/getting_started/security_auth/#twitter-app-configuration"
          },
          "socialAndKeysAzure": {
            "page": "security/social_and_keys",
            "section": "Azure",
            "url": "http://docs.backand.com/en/latest/getting_started/security_auth/#twitter-app-configuration"
          },
          "socialAndKeysADFS": {
            "page": "security/social_and_keys",
            "section": "ADFS",
            "url": "http://docs.backand.com/en/latest/getting_started/security_auth/#twitter-app-configuration"
          },
          "socialAndKeysGoogle": {
            "page": "security/social_and_keys",
            "section": "Google",
            "url": "http://docs.backand.com/en/latest/getting_started/security_auth/index.html#google-app-configuration"
          },
          "refreshToken":{
            "page": "security/social_and_keys",
            "url":"http://docs.backand.com/en/latest/getting_started/sdk/index.html#managerefreshtoken"
          },
          "socialAndKeysGithub": {
            "page": "security/social_and_keys",
            "section": "Github",
            "url": "http://docs.backand.com/en/latest/getting_started/security_auth/index.html#github-app-configuration"
          },
          "objectsModel": {
            "page": "objects/model",
            "url": "http://docs.backand.com/en/latest/apidocs/security/index.html#introduction"
          },
          "preDefinedFilter":{
            "page":"objects/security",
            "url":"http://docs.backand.com/en/latest/getting_started/objects/index.html#pre-defined-filter"
          },
          "objectSecurityTemplate":{
            "page":"objects/security",
            "url":"http://docs.backand.com/en/latest/apidocs/security/index.html#roles-security-templates"
          },
          "registeredUsers":{
            "page":"security/users",
            "url":"http://docs.backand.com/en/latest/apidocs/security/index.html#link-your-apps-users-with-backands-registered-users"
          },
          "adminUsers":{
            "page":"security/team",
            "url":"http://docs.backand.com/en/latest/getting_started/security_auth/index.html#team"
          },
          "securityActions":{
            "page":"security/actions",
            "url":"http://docs.backand.com/en/latest/getting_started/security_auth/index.html#security-actions"
          },
          "securityTemplates":{
            "page":"security/actions",
            "url":"http://docs.backand.com/en/latest/getting_started/security_auth/index.html#security-templates"
          },
          "logConfiguration":{
            "page":"log/config",
            "url":"http://docs.backand.com/en/latest/getting_started/log/index.html#configuration"
          },
          "dataHistory":{
            "page":"log/config",
            "url":"http://docs.backand.com/en/latest/getting_started/log/index.html#data-history"
          },
          "appException":{
            "page":"log/exception",
            "url":"http://docs.backand.com/en/latest/getting_started/log/index.html#server-side-exceptions"
          },
          "nosqlQuery":{
            "url":"http://docs.backand.com/en/latest/apidocs/nosql_query_language/index.html",
            "page":"queries"
          },
          "realtime":{
            "url":"http://docs.backand.com/en/latest/apidocs/realtime/index.html",
            "page":"actoinhelp"
          },
          "ContinuousDeployment":{
            "page":"configuration",
            "url":"http://docs.backand.com/en/latest/what_would_you_like_to_do/continuous_deployment/index.html"
          },
          "crons":{
            "page":"cron",
            "url":"http://docs.backand.com/en/latest/getting_started/crons/index.html"
          }
        }

        $scope.location = locations[$scope.key].url || 'http://docs.backand.com';

        if($scope.withText != 'false'){
          $scope.readMore = '- read more';
          $scope.iconClass = 'ba-icon-external-link';
        }
        else {
          $scope.readMore = '';
          $scope.iconClass = 'ti-help-alt';
        }

      },
      template: '<a href="{{location}}" target="{{target}}" style="text-decoration: none;">{{readMore}}&nbsp;<i class="{{iconClass}}"></i></a>'
    };
  }

  angular.module('common.directives')
    .directive('baHelpLink', [baHelpLink]);
})();
