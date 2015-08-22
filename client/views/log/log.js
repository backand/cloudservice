(function () {

  function LogConfig($stateParams, $state, $log, NotificationService, AppLogService, $scope, ConfirmationPopup) {

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
        self.title = 'Log Configuration';
        self.names = {ViewName: 'Object Type', PK:'Object Name', FieldName: 'Field Name', Action: 'Event'};
      }
      else {
        self.title = 'Data History';
        self.names = {ViewName: 'Object Name', PK:'Object PK', FieldName: 'Column Name', Action: 'Event'};
      }

      setGridOptions();
    }());

    function setGridOptions () {
      self.gridOptions = {
        enableColumnResize: true,
        enablePaginationControls: false,
        useExternalSorting: true,
        columnDefs: [
          {
            name: 'UpdateDate',
            field: '__metadata.dates.UpdateDate',
            displayName: 'Updated',
            type: 'date',
            sort: {direction: 'desc', priority: 0}
          },
          {name: 'Username', displayName: 'Updated By', field: '__metadata.descriptives.Username.label'},
          {name: 'Action', field: '__metadata.descriptives.Action.label', displayName: self.names.Action},
          {name: 'ViewName', field: '__metadata.descriptives.ViewName.label', displayName: self.names.ViewName},
          {name: 'PK', field: '__metadata.descriptives.PK.label', displayName: self.names.PK},
          {name: 'FieldName', displayName: self.names.FieldName},
          {name: 'OldValue'},
          {name: 'NewValue'}
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          //declare the events
          $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            if (sortColumns[0].name != 'UpdateDate')
              self.gridOptions.columnDefs[0].sort.direction = '';
            self.sort = '[{fieldName:"' + sortColumns[0].name + '", order:"' + sortColumns[0].sort.direction + '"}]';
            getLog();
          });
        }
      };

      self.gridOptions.columnDefs.forEach(function (columnDef) {
        columnDef.cellTemplate = '<div class="ui-grid-cell-contents" style="cursor: pointer;" ng-click="grid.appScope.log.showCellData(COL_FIELD, col.displayName)">{{COL_FIELD}}</div>';
      })
    }

    self.showCellData = function (COL_FIELD, displayName) {
      ConfirmationPopup.confirm(COL_FIELD, 'OK', '', true, false, displayName, 'lg')
    };

    $scope.$watch(function () {
      if (self.paginationOptions)
        return self.paginationOptions.pageNumber
    }, getLog);

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
      'ConfirmationPopup',
      LogConfig
    ]);

}());
