/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {


  angular.module('app')
    .controller('ViewData', [
      'NotificationService',
      'ColumnsService',
      '$scope',
      'usSpinnerService',
      'DbQueriesService',
      '$timeout',
      ViewData
    ]);

  function ViewData(NotificationService, ColumnsService, $scope, usSpinnerService, DbQueriesService, $timeout) {
    var self = this;
    self.title = '';
    self.sort = '';
    self.refreshOnce = false;

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
      ColumnsService.getData(
        self.paginationOptions.pageSize,
        self.paginationOptions.pageNumber,
        self.sort)
        .then(successDataHandler, errorHandler);
    }

    function successDataHandler(data) {
      self.gridOptions.data = data.data.data;
      var columns = [];
      if (data.data.data.length > 0)
        columns = _.without(Object.keys(data.data.data[0]), '__metadata');
      self.gridOptions.columnDefs = columns.map(function (column) {
        return {
          minWidth: 80,
          name: column
        }
      });
      self.gridOptions.totalItems = data.data.totalRows;

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
  }
}());
