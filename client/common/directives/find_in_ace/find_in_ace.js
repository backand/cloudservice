(function() {
  'use strict';

  angular.module('common.directives')
    .directive('bkndFindInAce', function() {
      return {
        scope: {
          editor : '=',
          nestingForm: '='
        },
        replace : true,
        templateUrl: 'common/directives/find_in_ace/find_in_ace.html',
        bindToController: true,
        controller: findInAceController,
        controllerAs: 'findInAce',
        link: findInAceLink
      };
    });

  function findInAceLink (scope, elm, attrs, ctrl) {

    var forms = ['findForm', 'replaceForm', 'findOptionsForm'];

    forms.forEach(function (form) {
      _.forOwn(scope[form], function (value, key) {
        if (!_.startsWith(key, '$')){
          scope[form][key].$pristine = false;
        }
      })
    });
  }

  function findInAceController () {
    var self = this;
    self.searchOptions = {};

    function resetFind (backwards) {
      self.replaceNow = true;
      self.searchOptions.backwards = backwards;
    }

    function getTerm () {
      if (!self.searchTerm) {
        self.searchTerm = self.editor.getSelectedText();
      }
    }

    self.findNext = function () {
      resetFind();
      getTerm();
      self.searchOptions.start = null;
      return self.editor.find(self.searchTerm, self.searchOptions);
    };

    self.findOnChange = function () {
      resetFind();
      self.searchOptions.start = self.editor.getSelectionRange().start;
      return self.editor.find(self.searchTerm, self.searchOptions);
    };

    self.findAndReplace = function () {
      if (self.editor.getReadOnly()) {
        return;
      }
      self.replaceNow ? self.editor.replace(self.replaceTerm) : self.editor.find(self.searchTerm, self.searchOptions);
      self.replaceNow = !self.replaceNow;
    };

    self.findPrev = function () {
      resetFind(true);
      getTerm();
      return self.editor.find(self.searchTerm, self.searchOptions);
    };

  }

}());
