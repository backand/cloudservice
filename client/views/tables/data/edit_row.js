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

    self.getAutocomplete = function (columnName, term) {
      return DataService.getAutocomplete(self.tableName, columnName, term)
        .then(function(result) {
          results = $filter('orderBy')(result.data, 'value');
          return results;
        });
    };

  }

}());
