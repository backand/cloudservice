(function() {
  'use strict';

  angular.module('common.directives')
    .directive('bkndFindInAce', function() {
      return {
        scope: {
          editor : '='
        },
        replace : true,
        templateUrl: 'common/directives/find_in_ace/find_in_ace.html',
        bindToController: true,
        controller: ['$scope', findInAceController],
        controllerAs: 'findInAce'
      };
    });

  function findInAceController () {
    var self = this;
    self.searchOptions = {};

    self.findNext = function () {
      self.replaceNow = true;
      self.searchOptions.start = null;
      return self.editor.find(self.searchTerm, self.searchOptions);
    };

    self.findOnChange = function () {
      self.replaceNow = true;
      self.searchOptions.start = self.editor.getSelectionRange().start;
      return self.editor.find(self.searchTerm, self.searchOptions);
    };

    self.findAndReplace = function () {
      self.replaceNow ? self.editor.replace(self.replaceTerm) : self.editor.find(self.searchTerm, self.searchOptions);
      self.replaceNow = !self.replaceNow;
    };

  }

}());
