/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function ViewData($log, NotificationService, ColumnsService, $scope) {

    var self = this;
    this.title= '';
    this.sort = '';

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

    this.gridOptions = {
      enableColumnResize: true,
      enablePaginationControls: false,
      useExternalSorting: true,
      onRegisterApi: function( gridApi ) {
        $scope.gridApi = gridApi;
        //declare the events
        $scope.gridApi.core.on.sortChanged( $scope, function( grid, sortColumns ) {
          self.sort = '[{fieldName:"' + sortColumns[0].name + '", order:"' + sortColumns[0].sort.direction + '"}]';
          getData();
        });
      }
    };

    $scope.$watch('data.paginationOptions.pageNumber',getData)

    function getData() {
      ColumnsService.getData(self.paginationOptions.pageSize, self.paginationOptions.pageNumber, self.sort).then(successHandler, errorHandler)
    }

    function successHandler(data) {
      self.gridOptions.data = data.data.data;
      self.gridOptions.totalItems = data.data.totalRows;
    }

    this.pageMax = function (pageSize, currentPage, max) {
      return Math.min((pageSize * currentPage), max);
    };

    function errorHandler(error, message) {
      NotificationService.add('error', message);
      $log.debug(error);
    }
  }

  angular.module('app')
    .controller('ViewData', [
      '$log',
      'NotificationService',
      'ColumnsService',
      '$scope',
      ViewData
    ]);

}());
