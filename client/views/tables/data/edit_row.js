(function () {

  angular.module('backand')
    .controller('EditRowController', [
      '$modalInstance',
      'tableName',
      'editRowData',
      'DataService',
      '$filter',
      EditRowController
    ]);

  function EditRowController(modalInstance,
                             tableName,
                             editRowData,
                             DataService,
                             $filter) {
    var self = this;

    self.tableName = tableName;
    self.editRowData = editRowData;

    self.getLabel = function (text) {
      return text.replace(/_/g, ' ');
    };

    self.saveRow = function (reopen) {
      var record = {};
      self.savingRow = true;
      self.editRowData.entities.forEach(function (entity) {
        if (entity.value !== null)
          record[entity.key] = entity.value;
      });

      if (self.editRowData.id) {
        DataService.update(self.tableName, record, self.editRowData.id)
          .then(modalInstance.close);
      }
      else {
        DataService.post(self.tableName, record)
          .then(modalInstance.close.bind(this, {reopen: reopen}));
      }
    };

    self.saveAndNew = function () {
      self.saveRow(true);
    };

    self.cancelEditRow = function () {
      modalInstance.dismiss('cancel');
    };

    self.getSingleSelectLabel = function (row, item) {
      if (typeof row !== 'object')
        return row;

      var descriptive = item.relatedView.descriptiveColumn;
      var descriptiveLabel = row.__metadata.id + ': ' +  row[descriptive];

      var fields=[];

      _.forEach(row, function (value, key) {
        if (key !== '__metadata' && key !== descriptive && !_.isEmpty(value)) {
          fields.push({key: key, value: value});
        }
      });

      return {descriptiveLabel: descriptiveLabel, fields: fields};
    };

    self.getSingleAutocomplete = function (item, query) {
      return DataService.search(item.relatedView.object, query)
        .then(function(result) {
          results = $filter('orderBy')(result.data.data, '__matadata.id');
          return results;
        });
    };

    self.getAutocomplete = function (columnName, query) {
      return DataService.getAutocomplete(self.tableName, columnName, query)
        .then(function(result) {
          results = $filter('orderBy')(result.data, 'value');
          return results;
        });
    };

    self.getMultiSelectLabel = function (row) {
      var label = '';
      _.forEach(row, function (value, key) {
        label += key + ': '+ value +'; ' ;
      });
      return label;
    };

    self.getMultiAutocomplete = function (columnName, term, item) {
      item.words = _.words(term, /[^, ]+/g);
      var query = _.last(item.words);
      return self.getAutocomplete(columnName, query);
    };

    self.onMultiSelect = function (item, $model) {
      item.value = (item.words && item.words.length > 1 ? _.dropRight(item.words).join() + ',' : '') + $model
    };

  }

}());
