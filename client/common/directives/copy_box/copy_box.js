(function() {
  'use strict';

  function bkndCopyBox() {
    return {
      restrict: 'E',
      scope: {
        content: '&',
        type: '@?',
        disable: '&' //TODO
      },
      bindToController: true,
      controllerAs: 'copy',
      controller: ['bkndCopyBoxService', bkndCopyBoxController],
      templateUrl: 'common/directives/copy_box/copy_box.html'
    };
  }

  function bkndCopyBoxController (bkndCopyBoxService) {
    var self = this;

    self.copied = bkndCopyBoxService.copied;

    self.getContent = function () {
      self.contentToCopy = self.content();
      return self.contentToCopy;
    };

    self.setContentCopied = function () {
      if (self.contentToCopy) {
        self.copied.last = self;
      }
    };

    self.isContentCopied = function () {
      return self.copied.last === self;
    };
  }

  angular.module('common.directives')
    .directive('bkndCopyBox', bkndCopyBox)
    .service('bkndCopyBoxService', function () {
      this.copied = {}
    });
})();
