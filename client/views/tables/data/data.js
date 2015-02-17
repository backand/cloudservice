/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function ViewData($log, NotificationService, ColumnsService, $scope, usSpinnerService, DbQueriesService) {

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
      $scope.$on('tabs:data', dataEvent);
      $scope.$on('clearData', clearData);
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

    function clearData(){
      self.gridOptions.data = null;
    }

    /**
     * Get the broadcast
     * @param args
     */
    function dataEvent(obj,args){
      if(args){
        self.queryName = args.query;
        self.appName = args.app;
        self.parameters = JSON.stringify(args.parameters);
      }
      else{
        self.queryName = null;
      }
      getData();
    }

    $scope.$watchGroup([
        'data.paginationOptions.pageNumber',
        'data.paginationOptions.pageSize']
      , getPageData);

    function getPageData(newVal, oldVal) {
      if (newVal !== oldVal)
        getData();
    }

    function getData() {
      usSpinnerService.spin("loading");
      if(self.queryName == null){
        ColumnsService.getData(self.paginationOptions.pageSize, self.paginationOptions.pageNumber, self.sort).then(successDataHandler, errorHandler);
      }
      else {
        DbQueriesService.runQuery(self.appName, self.queryName, self.parameters).then(successQueryHandler, errorHandler);
      }
    }

    function successDataHandler(data) {
      self.gridOptions.data = data.data.data;
      var columns = [];
      if (data.data.data.length > 0)
        _.without(Object.keys(data.data.data[0]), '__metadata')
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

    function successQueryHandler(data) {
      self.gridOptions.data = data.data;
      var columns = _.at(data.data);
      self.gridOptions.columnDefs = columns.map(function (column) {
        return {
          minWidth: 80,
          name: column
        }
      });
      self.gridOptions.totalItems = data.data.length;

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

  angular.module('app')
    .controller('ViewData', [
      '$log',
      'NotificationService',
      'ColumnsService',
      '$scope',
      'usSpinnerService',
      'DbQueriesService',
      ViewData
    ]);

}());
