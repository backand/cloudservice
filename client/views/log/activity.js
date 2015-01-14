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
      isException = ($state.$current.url.prefix.indexOf('/exception/') > -1);
      if(isException)
        self.title ='APP Exceptions'
      else
        self.title ='APP Activity'
    }());

    this.gridOptions = {
      enableColumnResize: true,
      enablePaginationControls: false,
      useExternalSorting: true,
      columnDefs: [
        {name: 'ID', displayName:'Exception Id', sort:{direction: 'desc', priority:0}},
        {name: 'Username', displayName:'Updated By'},
        {name: 'Time', displayName:'Time', type: 'datetime'},
        {name: 'ExceptionMessage'},
        {name: 'Trace', displayName: 'Additional Info'}
      ],
      onRegisterApi: function( gridApi ) {
        $scope.gridApi = gridApi;
        //declare the events
        $scope.gridApi.core.on.sortChanged( $scope, function( grid, sortColumns ) {
          if(sortColumns[0].name != 'ID')
            self.gridOptions.columnDefs[0].sort.direction = '';
          self.sort = '[{fieldName:"' + sortColumns[0].name + '", order:"' + sortColumns[0].sort.direction + '"}]';
          getLog();
        });
      }
    };

    $scope.$watch('log.paginationOptions.pageNumber',getLog)

    function getLog() {
      AppLogService.getAppActivity($stateParams.name, self.paginationOptions.pageSize, self.paginationOptions.pageNumber, isException, self.sort)
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

  angular.module('app')
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
