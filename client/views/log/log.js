(function () {

  function LogConfig($stateParams, $state, $log, NotificationService, AppLogService, $scope, ConfirmationPopup, usSpinnerService, $timeout) {

    var self = this;
    var isAdmin;
    self.title= '';
    self.sort = '[{fieldName:"UpdateDate", order:"desc"}]';
    self.showFilter = true;
    self.lastQuery = [];

    self.paginationOptions = {
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
        self.helpKey = 'logConfiguration';
        self.names = {ViewName: 'Entity', PK:'Entity Name / Id', FieldName: 'Property Name', Action: 'Event'};
      }
      else {
        self.title = 'Data History';
        self.helpKey = 'dataHistory';
        self.names = {ViewName: 'Object Name', PK:'Object Id', FieldName: 'Field Name', Action: 'Event'};
      }

      setGridOptions();
      getFilterOptions();
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

    self.toggleShowFilter = function () {
      if (self.filterReady) {
        self.showFilter = !self.showFilter;
      }
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

      //add Admin status to the grid filter
      self.lastQuery.push({fieldName:"Admin", operator:"equals", value:String(isAdmin)});

      getLog();

    };

    function getFilterOptions () {
      self.filterOptions = {
        fields: getFieldsForFilter(),
        operators: null
      };
      self.filterReady = true;
      self.lastQuery = [{fieldName:"Admin", operator:"equals", value:String(isAdmin)}];

    }

    function getFieldsForFilter () {
      return [
        {name: "UpdateDate", "type":"DateTime"},
        {name: "FieldName",type:"text"},
        {name: "OldValue",type:"text"},
        {name: "NewValue",type:"text"}
      ];
    }

    <!-- End Filter -->

    $scope.$watch(function () {
      if (self.paginationOptions)
        return self.paginationOptions.pageNumber
    }, getLog);

    function getLog() {
      usSpinnerService.spin('loading');
      AppLogService.getAppLog($stateParams.appName, self.paginationOptions.pageSize, self.paginationOptions.pageNumber, self.lastQuery, self.sort)
        .then(logSuccsessHandler, errorHandler);
    }

    function logSuccsessHandler(data) {
      self.gridOptions.data = data.data.data;
      self.gridOptions.totalItems = data.data.totalRows;
      $timeout(1).then(function () {
        self.gridApi.core.handleWindowResize();
      });
      usSpinnerService.stop("loading");
    }

    self.pageMax = function (pageSize, currentPage, max) {
      return Math.min((pageSize * currentPage), max);
    };

    function errorHandler(error, message) {
      usSpinnerService.stop("loading");
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
      'usSpinnerService',
      '$timeout',
      LogConfig
    ]);

}());
