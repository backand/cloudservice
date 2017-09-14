(function () {
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
            "url": "http://docs.backand.com/#the-user-object-and-security"
          },
          "securityAnonymousAccess": {
            "page": "security/auth",
            "section": "Anonymous Access",
            "url": "http://docs.backand.com/#anonymous-authentication"
          },
          "securitySignup": {
            "page": "security/auth",
            "section": "Public App",
            "url": "http://docs.backand.com/#security-configuration"
          },
          "customPages": {
            "page": "security/auth",
            "section": "Custom Registration Page URL",
            "url": "http://docs.backand.com/#security-configuration"
          },
          "emailVerification": {
            "page": "security/auth",
            "section": "Sign-up Email Verification",
            "url": "http://docs.backand.com/#email-verification-process"
          },
          "socialAndKeysGeneral": {
            "page": "security/social_and_keys",
            "url": "http://docs.backand.com/#social-keys"
          },
          "socialAndKeysMasterToken": {
            "page": "security/social_and_keys",
            "section": "Master Token",
            "url": "http://docs.backand.com/#social-keys"
          },
          "socialAndKeysAPISignupToken": {
            "page": "security/social_and_keys",
            "section": "API Sign-up Token",
            "url": "http://docs.backand.com/#social-keys"
          },
          "socialAndKeysFacebook": {
            "page": "security/social_and_keys",
            "section": "Facebook",
            "url": "http://docs.backand.com/#social-keys"
          },
          "socialAndKeysTwitter": {
            "page": "security/social_and_keys",
            "section": "Twitter",
            "url": "http://docs.backand.com/#social-keys"
          },
          "socialAndKeysAzure": {
            "page": "security/social_and_keys",
            "section": "Azure",
            "url": "http://docs.backand.com/#social-keys"
          },
          "socialAndKeysADFS": {
            "page": "security/social_and_keys",
            "section": "ADFS",
            "url": "http://docs.backand.com/#social-keys"
          },
          "socialAndKeysGoogle": {
            "page": "security/social_and_keys",
            "section": "Google",
            "url": "http://docs.backand.com/#social-keys"
          },
          "refreshToken": {
            "page": "security/social_and_keys",
            "url": "http://docs.backand.com/#authentication-with-oauth-2-0"
          },
          "socialAndKeysGithub": {
            "page": "security/social_and_keys",
            "section": "Github",
            "url": "http://docs.backand.com/#social-keys"
          },
          "objectsModel": {
            "page": "objects/model",
            "url": "http://docs.backand.com/#objects"
          },
          "preDefinedFilter": {
            "page": "objects/security",
            "url": "http://docs.backand.com/#objects"
          },
          "objectSecurityTemplate": {
            "page": "objects/security",
            "url": "http://docs.backand.com/#roles-security-templates"
          },
          "registeredUsers": {
            "page": "security/users",
            "url": "http://docs.backand.com/#link-your-apps-users-with-backands-registered-users"
          },
          "adminUsers": {
            "page": "security/team",
            "url": "http://docs.backand.com/#team"
          },
          "securityActions": {
            "page": "security/actions",
            "url": "http://docs.backand.com/#security-actions"
          },
          "securityTemplates": {
            "page": "security/actions",
            "url": "http://docs.backand.com/#security-templates"
          },
          "logConfiguration": {
            "page": "log/config",
            "url": "http://docs.backand.com/#configuration91"
          },
          "dataHistory": {
            "page": "log/config",
            "url": "http://docs.backand.com/#data-history"
          },
          "appException": {
            "page": "log/exception",
            "url": "http://docs.backand.com/#server-side-exceptions"
          },
          "nosqlQuery": {
            "url": "http://docs.backand.com/#nosql-query-language",
            "page": "queries"
          },
          "realtime": {
            "url": "http://docs.backand.com/#realtime-database-communications",
            "page": "actoinhelp"
          },
          "ContinuousDeployment": {
            "page": "configuration",
            "url": "http://docs.backand.com/#continuous-deployment-and-versioning"
          },
          "crons": {
            "page": "cron",
            "url": "http://docs.backand.com/#background-jobs"
          },
          "LambdaLauncher": {
            "page": "external_function/externalFunctions",
            "url": "http://docs.backand.com/#the-backand-lambda-launcher"
          },
          "LLSettingIAM": {
            "page": "LL Dialog Connection",
            "url": "http://docs.backand.com/#setting-up-iam-access-for-the-lambda-launcher"
          },
          "LLSettingCrossAccount": {
            "page": "LL Dialog Connection",
            "url": "http://docs.backand.com/#creating-cross-account-access-for-aws-lambda"
          },
          "LLSettingAzure": {
            "page": "LL Dialog Connection",
            "url": "http://docs.backand.com/#setting-up-iam-access-for-the-lambda-launcher"
          },
          "socialAmpKeys": {
            "page": "Social & Keys",
            "url": "http://docs.backand.com/#social-amp-keys"
          }
        };

        $scope.location = locations[$scope.key] ? locations[$scope.key].url : 'http://docs.backand.com';
        var text = $scope.withText ? String($scope.withText).toLowerCase() : 'false';

        if (text != 'false') {
          $scope.readMore = (text != 'true') ? $scope.withText : '- read more';
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
