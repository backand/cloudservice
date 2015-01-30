/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function ViewData($log, NotificationService, ColumnsService, $scope,usSpinnerService) {

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
      $scope.$on('tabs:data', getData);
    }());

    self.gridOptions = {
      enableColumnResize: false,
      enablePaginationControls: false,
      useExternalSorting: true,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        //declare the events

        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
          self.sort = '[{fieldName:"' + sortColumns[0].name + '", order:"' + sortColumns[0].sort.direction + '"}]';
          getData();
        });
      }
    };

    $scope.$watch('data.paginationOptions.pageNumber', function (newVal,oldValue){
        if(newVal != null && newVal !== oldValue)
          getData();
      });

    function getData() {
      if (self.gridOptions.data.length == 0) {
        usSpinnerService.spin("loading");
        ColumnsService.getData(self.paginationOptions.pageSize, self.paginationOptions.pageNumber, self.sort).then(successHandler, errorHandler);
        self.refreshOnce = false;
      }
    }

    function successHandler(data) {
      self.gridOptions.data = data.data.data;
      self.gridOptions.totalItems = data.data.totalRows;

      setTimeout(refreshGridDisplay(),1); //fix bug with bootstrap tab and ui grid
      usSpinnerService.stop("loading");
    }

    function refreshGridDisplay()
    {
      //if($scope.gridApi.grid.options.columnDefs[0].name == '__metadata')
      //  $scope.gridApi.grid.options.columnDefs.splice(0,1);
      if(!self.refreshOnce){
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

  angular.module('app')
    .controller('ViewData', [
      '$log',
      'NotificationService',
      'ColumnsService',
      '$scope',
      'usSpinnerService',
      ViewData
    ]);

}());
