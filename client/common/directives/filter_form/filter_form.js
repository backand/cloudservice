(function() {
  'use strict';

  function bkndFilterForm () {
    return {
      scope: {
        noRepeat: '@',
        query: '=',
        fields: '=',
        operators: '='
      },
      bindToController: true,
      controllerAs: 'filterForm',
      controller: filterFormController,
      templateUrl: 'common/directives/filter_form/filter_form.html'
    };
  }

  function filterFormController () {
    var self = this;

    self.query = [{}];

    self.addRow = function () {
      self.query.push({});
    };

    self.onFieldSelected = function (field) {
      if (self.noRepeat) {
        _.remove(self.fields, field);
      }
    };

    self.removePredicate = function (predicate) {
      _.remove(self.query, predicate);
      if (self.query.length === 0) {
        self.query.push({});
      }
      if (self.noRepeat) {
        self.fields.push(predicate.field);
      }
    };

  }

  angular.module('common.directives')
    .directive('bkndFilterForm', bkndFilterForm);
})();
