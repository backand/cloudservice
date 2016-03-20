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
        disableValue: '=',
        defaultFilter: '=',
        onSubmit: '&'
      },
      bindToController: true,
      controllerAs: 'filterForm',
      controller: filterFormController,
      templateUrl: 'common/directives/filter_form/filter_form.html'
    };
  }

  function filterFormController ($scope) {
    var self = this;

    if(!self.query) {
      self.query = [{}];
    }

    self.operatorsList = self.operators ||
        {
          text: ['equals', 'notEquals', 'startsWith', 'contains', 'notContains', 'empty', 'notEmpty'],
          Numeric: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqualsTo', 'lessThan', 'lessThanOrEqualsTo', 'empty', 'notEmpty'],
          DateTime: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqualsTo', 'lessThan', 'lessThanOrEqualsTo', 'empty', 'notEmpty'],
          select: ['in'],
          SingleSelect: ['in'],
          Boolean: ['is']
        };


    // Don't allow adding a new predicate when there are no more fields to filter
    // or if no field was chosen for one of the predicates
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

      predicate.operator = self.operatorsList[predicate.field.type][0];
    };

    self.removePredicate = function (predicate) {
      if (predicate.field) {
        _.remove(self.query, predicate);
        if (self.query.length === 0) {
          self.query.push({});
        }
        if (self.noRepeat) {
          self.fields.push(predicate.field);
          self.fields.sort(function (a, b) {
            return a.index - b.index;
          });
        }
      } else if (predicate === _.last(self.query) && self.query.length > 1) {
        _.pullAt(self.query, self.query.length - 1);
      }

      self.submit();
    };

    self.submit = function () {
      return self.onSubmit();
    };

    function addDefaultFilter() {
      if (self.defaultFilter) {
        self.query[0] = self.defaultFilter;
      }
    }

    addDefaultFilter();

  }

})();
