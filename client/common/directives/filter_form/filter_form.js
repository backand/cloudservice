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

    self.showAddButton = function () {
      return (self.fields && self.fields.length > 0 && (self.query.length === 0 || _.last(self.query).field));
    };

    self.addRow = function () {
      var predicate = {};
      if (self.fields.length == 1) {
        predicate.field = self.fields[0];
        self.onFieldSelected(predicate);
      }
      self.query.push(predicate);
    };

    self.onFieldSelected = function (predicate) {
      if (self.noRepeat) {
        _.remove(self.fields, predicate.field);
      }

      if (self.operators[predicate.field.type].length === 1) {
        predicate.operator = self.operators[predicate.field.type][0];
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
