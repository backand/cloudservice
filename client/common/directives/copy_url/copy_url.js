/**
 * Created by shmuela on 03/03/15.
 */
(function() {
  'use strict';

  function bkndCopyUrl() {
    return {
      restrict: 'E',
      scope: {
        copyUrlParams: '=',
        type: '@'
      },
      bindToController: true,
      controllerAs: 'copyUrl',
      controller: function () {
        var self = this;

        function formsExist () {
          return (self.copyUrlParams.getInputForm() &&
            self.copyUrlParams.getTestForm())
        }
        function formsPristine () {
          return (self.copyUrlParams.getInputForm().$pristine &&
          self.copyUrlParams.getTestForm().$pristine)
        }

        self.getUrl = function () {
          if (!formsExist())
            return '';
          self.url =
            formsPristine() ? self.copyUrlParams.getUrl() : '';
          return self.url;
        };

        self.isUrlCopied = function () {
          if (!formsExist())
            return false;
          self.urlCopied =
            self.urlCopied && self.isUrlAvailable();
          return self.urlCopied;
        };

        self.isUrlAvailable = function () {
          if (!formsExist())
            return false;
          self.urlAvailable = !_.isEmpty(self.url) && formsPristine();
          return self.urlAvailable;
        };
      },
      templateUrl: 'common/directives/copy_url/copy_url.html'
    };
  }

  angular.module('common.directives')
    .directive('bkndCopyUrl', bkndCopyUrl);
})();
