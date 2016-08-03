(function () {

  function RequestsLog($stateParams, $state, $log, NotificationService, AppLogService, $scope, ConfirmationPopup, usSpinnerService, $timeout) {

    var self = this;
    var isRequests;
    self.title= '';
    self.sort = '[{fieldName:"Time", order:"desc"}]';
    self.showFilter = true;
    self.filter = "Request = '/1/query/data/getLatestReactions'";

    self.paginationOptions = {
      pageNumber: 1,
      pageSize: 100,
      pageSizes: [100,500, 1000]
    };

    /**
     * init the data
     */
    (function init() {
      isRequests = ($state.$current.url.source.indexOf('/requests') == -1);
      if(isRequests){
        self.title = 'API Requests';
        self.helpKey = 'logConfiguration';
      }
      else {
      }

      setGridOptions();
    }());

    function setGridOptions () {
      self.gridOptions = {
        enableColumnResize: true,
        enablePaginationControls: false,
        useExternalSorting: true,
        columnDefs: [
          {name: 'Guid'},
          {name: 'Request'},
          {name: 'Username'},
          {name: 'ClientIP'},
          {name: 'Time', sort: {direction: 'desc', priority: 0}},
          {name: 'Refferer'},
          {name: 'Duration'}
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          //declare the events
          $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            if (sortColumns[0].name != 'Time') {
              self.gridOptions.columnDefs[0].sort = {};
              self.gridOptions.columnDefs[0].sort.direction = '';
            }
            self.sort = '[{fieldName:"' + sortColumns[0].name + '", order:"' + sortColumns[0].sort.direction + '"}]';
            getLog();
          });
        }
      };

      self.gridOptions.columnDefs.forEach(function (columnDef) {
        columnDef.cellTemplate = '<div class="ui-grid-cell-contents" style="cursor: pointer;" ng-click="grid.appScope.log.showCellData(COL_FIELD, col.displayName)">{{COL_FIELD}}</div>';
      });

      getLog();
    }

    self.showCellData = function (COL_FIELD, displayName) {
      ConfirmationPopup.confirm(COL_FIELD, 'OK', '', true, false, displayName, 'lg')
    };

    self.toggleShowFilter = function () {
      self.showFilter = !self.showFilter;
    };
    

    function getLog() {
      usSpinnerService.spin('loading');
      AppLogService.getRequestsLog('requests',$stateParams.appName, self.filter, self.sort, self.paginationOptions.pageSize)
        .then(logSuccsessHandler, errorHandler);
    }

    function logSuccsessHandler(data) {
      self.gridOptions.data = data.data.data;
      self.gridOptions.totalItems = data.data.totalRows;
      usSpinnerService.stop("loading");
    }
    

    function errorHandler(error, message) {
      usSpinnerService.stop("loading");
      NotificationService.add('error', message);
      $log.debug(error);
    }
  }

  angular.module('backand')
    .controller('RequestsLog', [
      '$stateParams',
      '$state',
      '$log',
      'NotificationService',
      'AppLogService',
      '$scope',
      'ConfirmationPopup',
      'usSpinnerService',
      '$timeout',
      RequestsLog
    ]);

}());
