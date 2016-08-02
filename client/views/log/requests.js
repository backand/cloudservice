(function () {

  function RequestsLog($stateParams, $state, $log, NotificationService, AppLogService, $scope, ConfirmationPopup, usSpinnerService, $timeout) {

    var self = this;
    var isRequests;
    self.title= '';
    self.sort = '[{fieldName:"Time", order:"desc"}]';
    self.showFilter = true;
    self.lastQuery = [];


    /**
     * init the data
     */
    (function init() {
      isRequests = ($state.$current.url.source.indexOf('/requests') == -1);
      if(isRequests){
        self.title = 'API Requests';
        self.helpKey = 'logConfiguration';
        self.names = {ViewName: 'Entity', PK:'Entity Name / Id', FieldName: 'Property Name', Action: 'Event'};
      }
      else {
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

      getLog();

    };

    function getFilterOptions () {
      self.filterOptions = {
        fields: getFieldsForFilter(),
        operators: null
      };
      self.filterReady = true;
    }

    function getFieldsForFilter () {
      return [
        {name: "Time", "type":"DateTime"},
        {name: "Request",type:"text"},
        {name: "Username",type:"text"},
        {name: "ClientIP",type:"text"}
      ];
    }

    <!-- End Filter -->

    function getLog() {
      usSpinnerService.spin('loading');
      AppLogService.getRequestsLog('log',$stateParams.appName, self.lastQuery, self.sort)
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
