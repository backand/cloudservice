(function () {

  function LogConfig($stateParams, $state, $log, NotificationService, AppLogService, $scope) {

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
      isAdmin = ($state.$current.url.source.indexOf('/history') == -1);
      if(isAdmin){
        self.title ='Log Configuration';
        self.names = {ViewName: 'Entity Name', PK:'Entity Id', FieldName:'Property Name'};
      }
      else {
        self.title ='Data History';
        self.names = {ViewName: 'Table Name', PK:'Table PK', FieldName:'Column Name'};
      }
    }());

    this.gridOptions = {
      enableColumnResize: true,
      enablePaginationControls: false,
      useExternalSorting: true,
      columnDefs: [
        {name: 'UpdateDate', field:'__metadata.dates.UpdateDate', displayName: 'Updated', type: 'date', sort: {direction: 'desc', priority:0} },
        {name: 'Username', displayName:'Updated By', field:'__metadata.descriptives.Username.label'},
        {name: 'Action', field:'__metadata.descriptives.Action.label'},
        {name: 'ViewName', displayName:self.names.ViewName},
        {name: 'PK', displayName:self.names.PK},
        {name: 'FieldName', displayName:self.names.FieldName},
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

    $scope.$watch(function () {
      if (self.paginationOptions)
        return self.paginationOptions.pageNumber
    }, getLog)

    function getLog() {
      AppLogService.getAppLog($stateParams.appName, self.paginationOptions.pageSize, self.paginationOptions.pageNumber, isAdmin, self.sort)
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
    .controller('LogConfig', [
      '$stateParams',
      '$state',
      '$log',
      'NotificationService',
      'AppLogService',
      '$scope',
      LogConfig
    ]);

}());
