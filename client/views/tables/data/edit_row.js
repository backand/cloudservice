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
      reopen ? self.savingRowAndNew = true : self.savingRow = true;
      var record = {};
      self.editRowData.entities.forEach(function (entity) {
        if (!entity.hide && !entity.disable) {
          if (entity.type === 'point') {
            // Convert object to array
            entity.value = _.map(entity.value, function (value, key) {
              return value;
            });
          }
            record[entity.key] = entity.value;
          if (entity.type === 'checkbox' && entity.required && _.isEmpty(entity.value)) {
            record[entity.key] = false;
          }
        }
      });

      if (self.editRowData.id) {
        DataService.update(self.tableName, record, self.editRowData.id, true)
          .then(modalInstance.close)
          .finally(function () {
            self.savingRow = false;
            self.savingRowAndNew = false;
          });
      }
      else {
        DataService.post(self.tableName, record, true)
          .then(function () {
            modalInstance.close({reopen: reopen})
          })
          .finally(function () {
            self.savingRow = false;
            self.savingRowAndNew = false;
          });
      }
    };

    self.saveAndNew = function () {
      self.saveRow(true);
    };

    self.cancelEditRow = function () {
      modalInstance.dismiss('cancel');
    };

    self.getAutocomplete = function (columnName, query) {
      return DataService.getAutocomplete(self.tableName, columnName, query)
        .then(function(result) {
          var results = $filter('orderBy')(result.data, 'value');
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
      item.value = (item.words && item.words.length > 1 ? _.dropRight(item.words).join() + ',' : '') + $model;
    };

  }

}());
