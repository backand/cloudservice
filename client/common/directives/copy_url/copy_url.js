/**
 * Created by shmuela on 03/03/15.
 */
(function() {
  'use strict';

  function bkndCopyUrl() {
    return {
      restrict: 'E',
      scope: {
        copyUrlParams: '='
      },
      link: function ($scope) {

        function formsExist () {
          return ($scope.copyUrlParams.getInputForm() &&
            $scope.copyUrlParams.getTestForm())
        }
        function formsPristine () {
          return ($scope.copyUrlParams.getInputForm().$pristine &&
          $scope.copyUrlParams.getTestForm().$pristine)
        }

        $scope.getUrl = function () {
          if (!formsExist())
            return '';
          $scope.url =
            formsPristine() ? $scope.copyUrlParams.getUrl() : '';
          return $scope.url;
        };

        $scope.isUrlCopied = function () {
          if (!formsExist())
            return false;
          $scope.urlCopied =
            $scope.urlCopied && $scope.isUrlAvailable();
          return $scope.urlCopied;
        };

        $scope.isUrlAvailable = function () {
          if (!formsExist())
            return false;
          $scope.urlAvailable = !_.isEmpty($scope.url) && formsPristine();
          return $scope.urlAvailable;
        };
      },
      templateUrl: 'common/directives/copy_url/copy_url.html'
    };
  }

  angular.module('common.directives')
    .directive('bkndCopyUrl', bkndCopyUrl);
})();
