/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function LogActivity($stateParams, $state, $log, NotificationService, AppLogService, $scope) {

    var self = this;
    var isException;
    this.title= '';
    this.sort = '[{fieldName:"ID", order:"desc"}]';

    this.paginationOptions = {
      pageNumber: 1,
      pageSize: 20,
      pageSizes: [20, 50, 100, 1000]
    };

    /**
     * init the data
     */
    (function init() {
      isException = ($state.$current.url.source.indexOf('/exception') > -1);
      if (isException)
        self.title ='APP Exceptions';
      else
        self.title ='APP Activity';
    }());

    this.gridOptions = {
      enablePaginationControls: false,
      useExternalSorting: true,
      columnDefs: [
        {name: 'ID', displayName: 'Exception Id', sort: {direction: 'desc', priority: 0}, width: 100},
        {name: 'Username', displayName: 'Updated By', width: 100},
        {name: 'Time', field: '__metadata.dates.Time', displayName: 'Time', type: 'datetime', width: 150},
        {name: 'ExceptionMessage', minWidth: 300}
        //{name: 'Trace', displayName: 'Additional Info'}
      ],
      onRegisterApi: function( gridApi ) {
        $scope.gridApi = gridApi;
        //declare the events
        $scope.gridApi.core.on.sortChanged( $scope, function( grid, sortColumns ) {
          if (sortColumns[0]) {
            if (sortColumns[0].name != 'ID')
              self.gridOptions.columnDefs[0].sort.direction = '';
            self.sort = '[{fieldName:"' + sortColumns[0].name + '", order:"' + sortColumns[0].sort.direction + '"}]';
          }
          else
            self.sort = '';
          getLog();
        });
      }
    };

    $scope.$watchGroup([
      'log.paginationOptions.pageNumber',
      'log.paginationOptions.pageSize']
      , getLog);

    function getLog() {
      AppLogService.getAppActivity(
        $stateParams.appName,
        self.paginationOptions.pageSize,
        self.paginationOptions.pageNumber,
        isException,
        self.sort)
        .then(logSuccsessHandler, errorHandler);
    }

    function logSuccsessHandler(data) {
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

  angular.module('backand')
    .controller('LogActivity', [
      '$stateParams',
      '$state',
      '$log',
      'NotificationService',
      'AppLogService',
      '$scope',
      LogActivity
    ]);

}());
