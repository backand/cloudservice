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

  function findInAceLink (scope, element, attrs) {
    var forms = ['findForm', 'replaceForm', 'findOptionsForm'];
    forms.forEach(function (form) {
      _.forOwn(scope[form], function (value, key) {
        if (!_.startsWith(key, '$')){
          // hack for angular 1.3.2-1.4.5
          // in angular 1.4.6 use: scope[form].$removeControl(scope[form][key])
          scope[form][key].$pristine = false;
          scope[form][key].$setPristine = angular.noop;
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
