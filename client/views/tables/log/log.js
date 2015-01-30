(function () {

  function LogData($stateParams, $log, NotificationService, AppLogService, $scope) {

    var self = this;
    var isAdmin;
    this.title= '';
    this.sort = '[{fieldName:"UpdateDate", order:"desc"}]';

    this.paginationOptions = {
      pageNumber: 1,
      pageSize: 20,
      pageSizes: [20, 50, 100, 1000]
    };

    /**
     * init the data
     */
    (function init() {
      isAdmin = true;
      $scope.$on('tabs:log', getLog);
    }());

    this.gridOptions = {
      enableColumnResize: true,
      enablePaginationControls: false,
      useExternalSorting: true,
      columnDefs: [
        {name: 'UpdateDate', field:'__metadata.dates.UpdateDate', displayName:'Updated', type: 'date', sort:{direction: 'desc', priority:0}},
        {name: 'Username', displayName:'Updated By', field:'__metadata.descriptives.Username.label'},
        {name: 'Action', field:'__metadata.descriptives.Action.label'},
        {name: 'FieldName'},
        {name: 'OldValue'},
        {name: 'NewValue'}
      ],
      onRegisterApi: function( gridApi ) {
        $scope.gridApi = gridApi;
        //declare the events
        $scope.gridApi.core.on.sortChanged( $scope, function( grid, sortColumns ) {
          if(sortColumns[0].name != 'UpdateDate')
            self.gridOptions.columnDefs[0].sort.direction = '';
          self.sort = '[{fieldName:"' + sortColumns[0].name + '", order:"' + sortColumns[0].sort.direction + '"}]';
          getLog();
        });
      }
    };

    $scope.$watch('log.paginationOptions.pageNumber',getLog)

    function getLog() {
      AppLogService.getAppLog($stateParams.name, self.paginationOptions.pageSize, self.paginationOptions.pageNumber, isAdmin, self.sort, $stateParams.tableName)
        .then(logSuccsessHandler, errorHandler);
    }

    function logSuccsessHandler(data) {
      self.gridOptions.data = data.data.data;
      self.gridOptions.totalItems = data.data.totalRows;

      setTimeout(refreshGridDisplay(),1); //fix bug with bootstrap tab and ui grid
    }

    function refreshGridDisplay()
    {
      //if($scope.gridApi.grid.options.columnDefs[0].name == '__metadata')
      //  $scope.gridApi.grid.options.columnDefs.splice(0,1);
      if(!self.refreshOnce){
        setTimeout("$('#grid-container').trigger('resize')", 1); //resize the tab to fix the width issue with UI grid
        self.refreshOnce = true;
      }

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
    .controller('LogData', [
      '$stateParams',
      '$log',
      'NotificationService',
      'AppLogService',
      '$scope',
      LogData
    ]);

}());
