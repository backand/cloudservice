/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function LogActivity($stateParams, $state, $log, NotificationService, AppLogService, $scope, ConfirmationPopup, usSpinnerService) {

    var self = this;
    var typeFilter = "1";
    var tempColDefs = [];
    this.title= '';
    this.sort = '[{fieldName:"ID", order:"desc"}]';
    self.showFilter = true;
    self.lastQuery = [];

    this.paginationOptions = {
      pageNumber: 1,
      pageSize: 20,
      pageSizes: [20, 50, 100, 1000]
    };

    /**
     * init the data
     */
    (function init() {
      if ($state.$current.url.source.indexOf('/exception') > -1)
      {
        typeFilter = "1";
        self.helpKey = 'appException';
        self.title ='APP Exceptions';
        tempColDefs = [
          {name: 'ID', displayName: 'Exception Id', sort: {direction: 'desc', priority: 0}, width: 100},
          {name: 'Username', displayName: 'Updated By', width: 200},
          {name: 'Time', field: '__metadata.dates.Time', displayName: 'Time', type: 'datetime', width: 200},
          {name: 'ExceptionMessage',minWidth: 200}
        ];
      }
      else if ($state.$current.url.source.indexOf('/activity') > -1) {
        typeFilter = "3";
        self.helpKey = 'appException';
        self.title ='APP Activity';
        tempColDefs = [];
      }
      else if ($state.$current.url.source.indexOf('/console') > -1) {
        typeFilter = "500";
        self.helpKey = 'appException';
        self.title ='App Console';
        tempColDefs = [
          {name: 'ID', displayName: 'Id', sort: {direction: 'desc', priority: 0}, width: 100},
          {name: 'Username', displayName: 'Logged By', width: 200},
          {name: 'Time', field: '__metadata.dates.Time', displayName: 'Time', type: 'datetime', width: 200},
          {name: 'FreeText', 'displayName':'Trace', minWidth: 200}
        ];
      }

      getFilterOptions();

    }());

    this.gridOptions = {
      enablePaginationControls: false,
      useExternalSorting: true,
      columnDefs: tempColDefs,
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

    this.gridOptions.columnDefs.forEach(function (columnDef) {
      columnDef.cellTemplate = '<div class="ui-grid-cell-contents" style="cursor: pointer;" ng-click="grid.appScope.log.showCellData(COL_FIELD, col.displayName)">{{COL_FIELD}}</div>';
    });

    self.showCellData = function (COL_FIELD, displayName) {
      ConfirmationPopup.confirm(COL_FIELD, 'OK', '', true, false, displayName, 'lg')
    };

    <!-- Filter -->

    self.disableValue = function (operator) {
      return ['empty', 'notEmpty'].indexOf(operator) > -1;
    };

    function filterValid (item) {
      return item.field
          && item.operator
          && (item.value || self.disableValue(item.operator));
    }

    self.filterData = function () {

      usSpinnerService.spin("loading");

      var query = _.map(self.filterQuery, function (item) {

        if (filterValid(item)) {
          return {
            fieldName: item.field.name,
            operator: item.operator || 'equals',
            value: self.disableValue(item.operator) ? '' : item.value || ''
          };
        }
      });

      query = _.compact(query);
      if (_.isEqual(query, self.lastQuery)) {
        usSpinnerService.stop("loading");
        return;
      }
      self.lastQuery = query;

      //add isException status to the grid filter
      self.lastQuery.push({fieldName:"LogType", operator:"equals", value: typeFilter});


      getLog();

    };

    function getFilterOptions () {
      self.filterOptions = {
        fields: getFieldsForFilter(),
        operators: null
      };
      self.filterReady = true;
      self.lastQuery = [{fieldName:"LogType", operator:"equals", value: typeFilter}];
    }

    function getFieldsForFilter () {
      return [
        {name: "ID", "type":"Numeric"},
        {name: "Username",type:"text"},
        {name: "Time",type:"DateTime"},
        {name: "ExceptionMessage",type:"text"}
      ];
    }

    <!-- End Filter -->

    $scope.$watchGroup([
      'log.paginationOptions.pageNumber',
      'log.paginationOptions.pageSize']
      , getLog);

    function getLog() {


      AppLogService.getAppActivity(
        $stateParams.appName,
        self.paginationOptions.pageSize,
        self.paginationOptions.pageNumber,
        self.lastQuery,
        self.sort)
        .then(logSuccsessHandler, errorHandler);
    }

    function logSuccsessHandler(data) {
      self.gridOptions.data = data.data.data;
      self.gridOptions.totalItems = data.data.totalRows;
      usSpinnerService.stop("loading");
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
      'ConfirmationPopup',
      'usSpinnerService',
      LogActivity
    ]);

}());
