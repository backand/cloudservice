/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {


  angular.module('app')
    .controller('ViewData', [
      'NotificationService',
      'ColumnsService',
      'DataService',
      '$scope',
      'usSpinnerService',
      'DbQueriesService',
      '$timeout',
      '$rootScope',
      'tableName',
      ViewData
    ]);

  function ViewData(NotificationService, ColumnsService, DataService, $scope, usSpinnerService, DbQueriesService, $timeout, $rootScope, tableName) {
    var self = this;
    self.tableName = tableName;
    self.title = '';
    self.sort = '';
    self.refreshOnce = false;
    $rootScope.data = self;

    this.paginationOptions = {
      pageNumber: 1,
      pageSize: 20,
      pageSizes: [20, 50, 100, 1000]
    };

    /**
     * init the data
     */
    (function init() {
      getData();
    }());

    self.gridOptions = {
      enablePaginationControls: false,
      useExternalSorting: true,
      excludeProperties: '__metadata',
      excessColumns: 20,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        //declare the events

        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
          if (sortColumns[0])
            self.sort = '[{fieldName:"' + sortColumns[0].name + '", order:"' + sortColumns[0].sort.direction + '"}]';
          else
            self.sort = '';
          getData();
        });
      }
    };

    $scope.$watchGroup([
        'data.paginationOptions.pageNumber',
        'data.paginationOptions.pageSize']
      , getPageData);

    function getPageData(newVal, oldVal) {
      if (newVal !== oldVal)
        getData();
    }

    function getData() {
      $timeout(function() { usSpinnerService.spin("loading") });

      ColumnsService.get(false)
        .then(successColumnsHandler, errorHandler)
        .then(function () {
          return DataService.get(self.tableName, self.paginationOptions.pageSize, self.paginationOptions.pageNumber, self.sort);
        })
        .then(successDataHandler, errorHandler);
    }

    function successColumnsHandler (data) {
      self.columnDefs = data.fields;
    }

    function successDataHandler(response) {
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
          cellTemplate: getCellEditTemplate(columnInfo)
        }
      });
      if(_.last(self.gridOptions.columnDefs))
        _.last(self.gridOptions.columnDefs).minWidth = 286;

      self.gridOptions.totalItems = response.data.totalRows;

      setTimeout(refreshGridDisplay(), 1); //fix bug with bootstrap tab and ui grid
      usSpinnerService.stop("loading");
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
      NotificationService.add('error', message);
      usSpinnerService.stop("loading");
    }
    function getCellEditTemplate (column) {
      if (column.name === 'Id') return undefined;
      var type = 'text';
      var extraOptions = '';
      var calllbackOptions = ' onbeforesave="$root.data.onUpdateRowCell(row, col, $data)"';
      switch (column.type) {
        case 'Numeric':
          type = 'text'; // Also floats, so can't use number
          break;
        case 'DateTime':
          return '<span class="ui-grid-cell-contents" editable-date="MODEL_COL_FIELD" '
                  + calllbackOptions
                  + '>{{COL_FIELD | date:"MM/dd/yyyy" CUSTOM_FILTERS }}</span>'
                  + '<span class="ui-grid-cell-contents" editable-bstime="MODEL_COL_FIELD" e-show-meridian="false" '
                  + calllbackOptions
                  + '>{{COL_FIELD | date:"HH:mm:ss" CUSTOM_FILTERS }}</span>';
          break;
        case 'ShortText':
          type = 'text';
          break;
        case 'SingleSelect':
          // type = 'select';
          break;
        case 'LongText':
          type = 'textarea';
          break;
        case 'Boolean':
          type = 'checkbox';
          break;
        default:
          type = 'text'
      }
      return '<div class="ui-grid-cell-contents" editable-' + type + '="MODEL_COL_FIELD" '
        + calllbackOptions
        + '>{{COL_FIELD CUSTOM_FILTERS}}</div>';
    }
    self.onUpdateRowCell = function(row, col, newValue) {
      var updatedObject = angular.copy(row.entity);
      updatedObject[col.name] = newValue;
      return DataService.update(self.tableName, updatedObject);
    }

    function fixDatesInData(data) {
      self.columnDefs.forEach(function(columnDef) {
        if (columnDef.type == 'DateTime') {
          self.gridOptions.data.forEach(function(row) {
            row[columnDef.name] = new Date(row[columnDef.name]);
          })
          console.log(self.gridOptions.data);
        }
      });
    }
  }
}());
