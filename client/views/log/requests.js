(function () {

  function RequestsLog($stateParams, $state, $log, NotificationService, AppLogService, $scope, ConfirmationPopup, usSpinnerService, uiGridConstants) {

    var self = this;
    self.loading = false;
    self.title= '';
    self.sort = '[{fieldName:"Time", order:"desc"}]';
    self.showFilter = true;
    self.filter = "";// "Request = '/1/query/data/getLatestReactions'";
    self.customizeFilter = false;
    self.refreshOnce = false;
    self.viewMode = "";

    self.paginationOptions = {
      pageNumber: 1,
      pageSize: 100,
      pageSizes: [100,500, 1000]
    };

    /**
     * init the data
     */
    (function init() {
      switch($state.current.name){
        case "log.requests":
          self.viewMode = "requests";
          self.title = 'API Requests';
          self.helpKey = 'logConfiguration';
          self.addFilter = '';
          break;
        case "log.console":
          self.viewMode = "console";
          self.title = 'Console Log Messages';
          self.helpKey = 'logConfiguration';
          self.addFilter = 'LogMessage <> ""';
          break;
        case "log.exception":
          self.viewMode = "exception";
          self.title = 'Server Side Exceptions';
          self.helpKey = 'logConfiguration';
          self.addFilter = 'ExceptionMessage <> ""';
          break;
      };

      setGridOptions();
    }());

    //Guid,Request,Type,ObjectName,QueryName,ActionName,Username,ClientIP,Time,Refferer, Duration,Method,LogMessage,ExceptionMessage ,Trace

    function setGridOptions () {
      self.gridOptions = {
        enablePaginationControls: false,
        useExternalSorting: true,
        useExternalFiltering: true,
        enableFiltering: true,
        columnDefs: [
          {name: 'Guid',
            minWidth: 300,
            filter:{
              term: $stateParams.q
            }
          },
          {name: 'Time', type:"date", minWidth: 180, sort: {direction: 'desc', priority: 0}
            // ,cellFilter: 'date:"MM/dd/yyyy"',
            // filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="datetime" ng-model="colFilter.term" style="font-size:12px"/></div>',
            // filters:
            // [
            //   {
            //     filterName: "greaterThan",
            //     condition: uiGridConstants.filter.GREATER_THAN,
            //     placeholder: 'greater than'
            //   },
            //   {
            //     filterName: "lessThan",
            //     condition: uiGridConstants.filter.LESS_THAN,
            //     placeholder: 'less than'
            //   }
            // ]
          },
          {name: 'Request', minWidth: 200},
          {name: 'LogMessage', displayName:"LogMessage", minWidth: 200},
          {name: 'Type',
            filter: {
              type: uiGridConstants.filter.SELECT,
              selectOptions: [{value: 'object', label: 'Object'}, {value: 'query', label: 'Query'}, {value: 'action',label: 'Action'}, {value: 'function',label: 'Function'}]
            },
            minWidth: 100
          },
          {name: 'ObjectName', displayName:"ObjectName", minWidth: 110},
          {name: 'QueryName', displayName: "QueryName", minWidth: 110},
          {name: 'ActionName', displayName:"ActionName", minWidth: 110},
          {name: 'Method', minWidth: 80},
          {name: 'Username', minWidth: 200},
          {name: 'ClientIP', displayName: "ClientIP", minWidth: 120},
          {name: 'Refferer', minWidth: 200},
          {name: 'Duration', minWidth: 80},
          {name: 'ExceptionMessage', displayName: "ExceptionMessage", minWidth: 140},
          {name: 'Trace', minWidth: 120}
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

          $scope.gridApi.core.on.filterChanged($scope, function () {
            self.buildFilter();
          });
        }
      };

      self.buildFilter = function(){
        self.filter = "";
        angular.forEach($scope.gridApi.grid.columns, function (column) {

          var value = column.filters[0].term;
          if(value) {
            if (self.filter != "")
              self.filter += " and ";

            self.filter += column.name + " = '" + value + "'";

          }
        });
      };

      self.gridOptions.columnDefs.forEach(function (columnDef) {
        if(columnDef.name != 'Guid')
          columnDef.cellTemplate = '<div class="ui-grid-cell-contents" style="cursor: pointer;" ng-click="grid.appScope.vm.showCellData(COL_FIELD, col.displayName)">{{COL_FIELD}}</div>';
        else
          columnDef.cellTemplate = '<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="" ng-click="grid.appScope.vm.filterOnGuid(COL_FIELD, col)">{{COL_FIELD}}</a></div>';
      });

      //q is only for guid
      if($stateParams.q != null){
        self.filter = "guid='"+$stateParams.q + "'";
      }

      getLog();
    }

    self.showCellData = function (COL_FIELD, displayName) {
      ConfirmationPopup.confirm(COL_FIELD, 'OK', '', true, false, displayName, 'lg')
    };

    self.filterOnGuid = function(COL_FIELD, col){
      $state.go($state.current.name,{q:COL_FIELD});
    };

    self.toggleShowFilter = function () {
      self.showFilter = !self.showFilter;
    };

    self.filterCustomized = function(status){
      self.customizeFilter = status;
      self.gridOptions.enableFiltering = !self.customizeFilter;
      self.buildFilter();
      $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.ALL );
    };

    $scope.ace = {
      dbType: 'pgsql',
      editors: {},
      onLoad: function (_editor) {
        $scope.ace.editors[_editor.container.id] = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    self.pageMax = function (pageSize, currentPage, max) {
      return Math.min((pageSize * currentPage), max);
    };

    self.applyFilter = function(){
      getLog();
    };

    self.gotoRealtime = function(){
      $state.go($state.current.name + "realtime");
    };

    function getLog() {
      usSpinnerService.spin('loading');
      var lFilter = (self.filter == "") ? self.addFilter : (self.addFilter == "") ? self.filter : self.addFilter + " and (" + self.filter + ")";

      AppLogService.getRequestsLog('requests',$stateParams.appName, lFilter, self.sort, self.paginationOptions.pageSize)
        .then(logSuccsessHandler, errorHandler);
    }

    function logSuccsessHandler(data) {
      self.gridOptions.data = data.data.data;
      self.gridOptions.totalItems = self.gridOptions.data.length;
      setTimeout(refreshGridDisplay(), 1); //fix bug with bootstrap tab and ui grid
      usSpinnerService.stop("loading");
    }

    function refreshGridDisplay() {
      if (!self.refreshOnce) {
        resizeGrid();
        self.refreshOnce = true;
      }
    }
    function resizeGrid() {
      setTimeout("$('#grid-container').trigger('resize');", 50);
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
      'uiGridConstants',
      RequestsLog
    ]);

}());
