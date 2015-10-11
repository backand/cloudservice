(function() {
  'use strict';

  angular.module('common.directives')
    .directive('bkndFilterForm', [bkndFilterForm]);

  function bkndFilterForm () {
    return {
      scope: {
        noRepeat: '@',
        query: '=',
        fields: '=',
        operators: '=',
        onSubmit: '&'
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

    self.submit = function () {
      self.loadingFilterResults = true;
      self.query.forEach(function (queryItem) {
        if (!queryItem.field) return;

        if (!queryItem.operator) {
          var operatorsForType = self.operators[queryItem.field.type];
          queryItem.operator =
            operatorsForType.indexOf('equals') !== -1 ? 'equals' : operatorsForType[0];
        }

        queryItem.value = queryItem.value || '';
      });

      return self.onSubmit()
        .finally(function () {
          self.loadingFilterResults = false;
      })
    }

  }

})();
