(function() {
  'use strict';

  angular.module('common.directives')
    .directive('bkndAceFeatures', function() {
      return {
        scope: {
          editor : '=',
          nestingForm: '=?'
        },
        replace : true,
        templateUrl: 'common/directives/ace-features/ace-features.html',
        transclude: true,
        bindToController: true,
        controller: ['$scope', aceFeaturesController],
        controllerAs: 'aceFeatures'
      };
    });

  function aceFeaturesController () {
    var self = this;

    self.getThemeClass = function () {
      if (self.editor) {
        return _.last(self.editor.getTheme().split('/'));
      }
    }

  }

}());
