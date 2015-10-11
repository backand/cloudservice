(function() {
  'use strict';

  angular.module('common.directives')
    .directive('bkndSingleSelectTypeahead', function () {
      return {
        scope: {
          inputId : '@',
          item: '=',
          field: '='
        },
        bindToController: true,
        replace: true,
        templateUrl: 'common/directives/single_select_typeahead/single_select_typeahead.html',
        controllerAs: 'singleSelect',
        controller: ['DataService', 'ObjectsService', '$filter', singleSelectController]
      };
    });

  function singleSelectController (DataService, ObjectsService, $filter) {
    var self = this;

    var field = self.field || self.item;

    self.getSingleSelectLabel = function (row) {
      if (typeof row !== 'object')
        return row;

      var descriptive = field.relatedView.descriptiveColumn;
      var descriptiveLabel = row.__metadata.id + ': ' + row[descriptive];

      var fields = [];

      _.forEach(row, function (value, key) {
        if (key !== '__metadata' && key !== descriptive && !_.isEmpty(value)) {
          fields.push({key: key, value: value});
        }
      });

      return {descriptiveLabel: descriptiveLabel, fields: fields};
    };

    self.getSingleAutocomplete = function (query) {
      var results;
      return DataService.search(field.relatedView.object, query)
        .then(function(result) {
          results = $filter('orderBy')(result.data.data, '__matadata.id');
          return results;
        })
        .then(function () {
          return ObjectsService.getObject(field.relatedView.object, query, true);
        })
        .then(function (object) {
          _.remove(results, {__metadata: {id : object.data.__metadata.id}});
          results.unshift(object.data);
          return results;
        }, function () {
          return results
        });
    };

  }

}());



