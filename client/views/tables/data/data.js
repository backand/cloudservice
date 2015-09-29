(function () {


  angular.module('backand')
    .controller('ObjectDataController', [
      'NotificationService',
      'ColumnsService',
      'DataService',
      '$scope',
      '$modal',
      'usSpinnerService',
      'tableName',
      'ConfirmationPopup',
      '$filter',
      ObjectDataController
    ]);

  function ObjectDataController(
    NotificationService,
    ColumnsService,
    DataService,
    $scope,
    $modal,
    usSpinnerService,
    tableName,
    ConfirmationPopup,
    $filter
  ) {

    var self = this;

    self.tableName = tableName;
    self.title = '';
    self.sort = '';
    self.refreshOnce = false;
    self.httpRequestsLog = DataService.log = [];

    this.paginationOptions = {
      pageNumber: 1,
      pageSize: 20,
      pageSizes: [20, 50, 100, 1000]
    };

    (function init() {
      getData(true, true);
    }());

    self.toggleShowLog = function () {
      self.showLog = !self.showLog;
      setTimeout("$('#grid-container').trigger('resize');", 1);
    };

    self.createData = function (data) {
      DataService.post(tableName, data, true);
    };

    self.refresh = function () {
      getData(false, true);
    };

    self.gridOptions = {
      enablePaginationControls: false,
      useExternalSorting: true,
      excludeProperties: '__metadata',
      excessColumns: 20,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        //declare the events

        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
          self.sort = sortColumns[0] ? '[{fieldName:"' + sortColumns[0].name + '", order:"' + sortColumns[0].sort.direction + '"}]' : '';
          getData(false, true);
        });
      }
    };

    $scope.$watchGroup([
        'ObjectData.paginationOptions.pageNumber',
        'ObjectData.paginationOptions.pageSize']
      , getPageData);

    function getPageData(newVal, oldVal) {
      if (newVal !== oldVal) {
        getData(false, true);
      }
    }

    function getData(force, log) {
      usSpinnerService.spin("loading-data");

      ColumnsService.get(force)
        .then(successColumnsHandler, errorHandler)
        .then(function () {
          return loadData(log);
        })
        .then(successDataHandler, errorHandler);
    }

    function loadData(log) {
      return DataService.get(self.tableName, self.paginationOptions.pageSize, self.paginationOptions.pageNumber, self.sort, null, log);
    }

    function successColumnsHandler (data) {
      self.columnDefs = data.fields;
      getEditRowData();
    }

    function successDataHandler(response) {
      self.gridOptions.totalItems = response.data.totalRows;
      if (self.gridOptions.totalItems === 0) {
        usSpinnerService.stop("loading-data");
        return;
      }

      self.gridOptions.data = response.data.data;
      var columns = [];
      if (response.data.data.length > 0) {
        columns = _.without(Object.keys(response.data.data[0]), '__metadata');
      }

      fixDatesInData();

      self.gridOptions.columnDefs = columns.map(function (column) {
        var columnInfo = _.find(self.columnDefs, {name: column});

        return {
          minWidth: 80,
          name: column,
          displayName: column,
          cellTemplate: getCellEditTemplate(columnInfo)
        }
      });

      addActionColumns();

      if(_.last(self.gridOptions.columnDefs))
        _.last(self.gridOptions.columnDefs).minWidth = 286; //for edit widget to be shown properly

      setTimeout(refreshGridDisplay(), 1); //fix bug with bootstrap tab and ui grid
      usSpinnerService.stop("loading-data");
    }

    function addActionColumns() {

      var actionColumnOptions = {
        width: 30,
        displayName: '',
        enableSorting: false,
        enableColumnMenu: false
      };

      var deleteColumnOptions = {
        name: 'delete',
        cellTemplate: '<div class="grid-icon" ng-click="grid.appScope.ObjectData.deleteRow($event, row)"><i class="ti-trash"/></div>'
      };
      angular.extend(deleteColumnOptions, actionColumnOptions);
      self.gridOptions.columnDefs.unshift(deleteColumnOptions);

      var editColumnOptions = {
        name: 'edit',
        cellTemplate: '<div class="grid-icon" ng-click="grid.appScope.ObjectData.editRow($event, row)"><i class="ti-pencil"/></div>'
      };
      angular.extend(editColumnOptions, actionColumnOptions);
      self.gridOptions.columnDefs.unshift(editColumnOptions);
    }

    function refreshGridDisplay() {
      if (!self.refreshOnce) {
        setTimeout("$('#grid-container').trigger('resize');", 1); //resize the tab to fix the width issue with UI grid
        self.refreshOnce = true;
      }
    }

    this.pageMax = function (pageSize, currentPage, max) {
      return Math.min((pageSize * currentPage), max);
    };

    function errorHandler(error, message) {
      usSpinnerService.stop("loading-data");
      NotificationService.add('error', message);
    }

    function getCellEditTemplate (column) {
      if (column.form.hideInEdit || column.form.disableInEdit || column.advancedLayout.excludeInUpdate) return undefined;

      var callbackOptions = ' onbeforesave="grid.appScope.ObjectData.onUpdateRowCell(row, col, $data)"';

      var type = getFieldType(column.type);

      if(type === 'multiSelect')
        return undefined;

      if (type == 'dateTime')
        return '<div class="ui-grid-cell-contents"><span editable-date="MODEL_COL_FIELD" '
          + callbackOptions
          + '>{{COL_FIELD | date:"MM/dd/yyyy" CUSTOM_FILTERS }}</span> '
          + '<span editable-bstime="MODEL_COL_FIELD" e-show-meridian="false" '
          + callbackOptions
          + '>{{COL_FIELD | date:"HH:mm:ss" CUSTOM_FILTERS }}</span></div>';

      if (type === 'singleSelect') {

        return '<div class="ui-grid-cell-contents" editable-text="MODEL_COL_FIELD" '
          + 'e-typeahead="item.__metadata.id as grid.appScope.ObjectData.getSingleSelectLabel(item, col) '
          + 'for item in grid.appScope.ObjectData.getSingleAutocomplete(col, $viewValue)" '
          + 'e-typeahead-template-url="views/tables/data/select_row_template.html" '
          + 'e-typeahead-editable="false" ' + callbackOptions
          + '>{{COL_FIELD CUSTOM_FILTERS}}</div>';
      }

      if (type === 'numeric') { type = 'text';} // todo: fix single-select
      // Search of Multi-Select keys doesn't work currently
      /*if (!_.isEmpty(column.relatedViewName)) {
        return '<div class="ui-grid-cell-contents" editable-text="MODEL_COL_FIELD" ' +
          'e-typeahead="item.value as item.value + \'. \' + item.label ' +
          'for item in grid.appScope.ObjectData.getAutocomplete(col.field, $viewValue)" '
          + callbackOptions
          + '>{{COL_FIELD CUSTOM_FILTERS}}</div>';
      }*/

      return '<div class="ui-grid-cell-contents" editable-' + type + '="MODEL_COL_FIELD" '
        + callbackOptions
        + '>{{COL_FIELD CUSTOM_FILTERS}}</div>';
    }

    self.getSingleSelectLabel = function (row, item) {
      if (typeof row !== 'object')
        return row;

      var descriptive = self.relatedViews[item.field].descriptiveColumn;
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
      return DataService.search(self.relatedViews[item.field].object, query)
        .then(function(result) {
          results = $filter('orderBy')(result.data.data, '__matadata.id');
          return results;
        });
    };


    self.getAutocomplete = function (columnName, term) {
      return DataService.getAutocomplete(self.tableName, columnName, term)
        .then(function(result) {
          results = $filter('orderBy')(result.data, 'value');
          return results;
        });
    };

    self.onUpdateRowCell = function(row, col, newValue) {
      var updatedObject = {};
      updatedObject[col.name] = newValue;
      var updatePromise = DataService.update(self.tableName, updatedObject, row.entity.__metadata.id, true);
      updatePromise
        .then(function () {
          return loadData()
        })
        .then(successDataHandler);
      return updatePromise;
    };

    function fixDatesInData() {
      self.columnDefs.forEach(function(columnDef) {
        if (columnDef.type == 'DateTime') {
          self.gridOptions.data.forEach(function(row) {
            var date = row[columnDef.name];
            row[columnDef.name] = date ? new Date(date) : '- - - - - - -';
          });
        }
      });
    }

    function getFieldType(type) {
      switch (type) {
        case 'MultiSelect':
          return 'multiSelect'; // Search of Multi-Select keys doesn't work currently
        case 'SingleSelect':
          return 'singleSelect';
        case 'Numeric':
          return 'numeric'; // Also floats, so can't use number
        case 'DateTime':
          return 'dateTime';
        case 'ShortText':
          return 'text';
        case 'LongText':
          return 'textarea';
        case 'Boolean':
          return 'checkbox';
        default:
          return 'text'
      }
    }

    // edit row modal

    self.newRow = function () {
      getEditRowEntity();
      openModal();
    };

    self.editRow = function (event, rowItem) {
      DataService.getItem(self.tableName, rowItem.entity.__metadata.id, true);
      getEditRowEntity(rowItem);
      openModal();
    };

    function getEditRowEntity(rowItem) {
      self.editRowData.id = rowItem ? rowItem.entity.__metadata.id : null;
      self.editRowData.entities = [];
      self.editRowData.form.forEach(function (formItem) {
        self.editRowData.entities.push({
          key: formItem.key,
          hide: formItem.hideInCreate && !rowItem || formItem.hideInEdit && rowItem || formItem.type === 'multiSelect',
          disable: formItem.disable || formItem.disableInCreate && !rowItem || formItem.disableInEdit && rowItem,
          required: formItem.required,
          value: rowItem ? rowItem.entity[formItem.key] : formItem.defaultValue,
          type: formItem.type,
          relatedView: formItem.relatedView
        });
      });
    }

    function resetEditRowData() {
      self.editRowData = {
        form: []
      };
      self.relatedViews = {};
    }

    function getEditRowData () {
      resetEditRowData();
      self.columnDefs.forEach(function (column) {

        var columnData = {
          disableInCreate: column.form.disableInCreate || column.advancedLayout.excludeInInsert,
          hideInCreate: column.form.hideInCreate,
          disableInEdit: column.form.disableInEdit || column.advancedLayout.excludeInUpdate,
          hideInEdit: column.form.hideInEdit,
          required: column.advancedLayout.required,
          defaultValue: column.advancedLayout.defaultValue,
          key: column.name,
          type: getFieldType(column.type)
        };

        if (!_.isEmpty(column.relatedViewName)) {
          ColumnsService.getColumns(column.relatedViewName)
            .then(function (response) {
              columnData.relatedView = {
                object: column.relatedViewName,
                descriptiveColumn: response.data.columnDisplayinTitle
              };
              self.relatedViews[column.name] = {object: column.relatedViewName,
                descriptiveColumn: response.data.columnDisplayinTitle};
            })
        }

        self.editRowData.form.push(columnData);

      });
    }

    function openModal () {
      var modalInstance = $modal.open({
        templateUrl: 'views/tables/data/edit_row.html',
        controller: 'EditRowController as EditRow',
        resolve: {
          editRowData: function () {
            return self.editRowData;
          },
          tableName: function () {
            return self.tableName;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if (result && result.reopen) {
          self.newRow();
        }
        else {
          usSpinnerService.spin("loading-data");
        }
        loadData()
          .then(successDataHandler);
      });
    }

    self.deleteRow = function (event, rowItem) {
      ConfirmationPopup.confirm('Are you sure you want to delete the object?')
        .then(function (result) {
          if (!result)
            return;
          usSpinnerService.spin("loading-data");
          DataService.delete(self.tableName, rowItem.entity, rowItem.entity.__metadata.id, true)
            .then(function () {
              return loadData()
            })
            .then(successDataHandler);
        });
    };
  }
}());
