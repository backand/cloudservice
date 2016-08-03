(function () {

  function RequestsLog($stateParams, $state, $log, NotificationService, AppLogService, $scope, ConfirmationPopup, usSpinnerService, $timeout) {

    var self = this;
    var isRequests;
    self.loading = false;
    self.title= '';
    self.sort = '[{fieldName:"Time", order:"desc"}]';
    self.showFilter = true;
    self.filter = "";// "Request = '/1/query/data/getLatestReactions'";
    self.filterChanged = false;
    self.filterEntityType = "";
    self.filterEntityName = "";

    self.entities = [
      {name: "all", label:"All"},
      {name: "object", label:"Object"},
      {name: "action", label:"Action"},
      {name: "query", label:"Query"},
      {name: "other", label:"Other"}
    ];
    self.paginationOptions = {
      pageNumber: 1,
      pageSize: 100,
      pageSizes: [100,500, 1000]
    };

    if($stateParams.q != null){
      self.filter = $stateParams.q;
    }

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
        if(columnDef.name != 'Guid')
          columnDef.cellTemplate = '<div class="ui-grid-cell-contents" style="cursor: pointer;" ng-click="grid.appScope.vm.showCellData(COL_FIELD, col.displayName)">{{COL_FIELD}}</div>';
        else
          columnDef.cellTemplate = '<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="" ng-click="grid.appScope.vm.filterOnGuid(COL_FIELD, col)">{{COL_FIELD}}</a></div>';
      });

      getLog();
    }

    self.showCellData = function (COL_FIELD, displayName) {
      ConfirmationPopup.confirm(COL_FIELD, 'OK', '', true, false, displayName, 'lg')
    };

    self.filterOnGuid = function(COL_FIELD, col){
      $state.go('log.requests',{q:"guid='" + COL_FIELD + "'"});
    };

    self.toggleShowFilter = function () {
      self.showFilter = !self.showFilter;
    };
    
    self.onFilterTextChanged = function(){
      self.filterChanged = (self.filter != "");
      if(self.filterChanged){
        self.filterEntityType = "";
        self.filterEntityName = "";
      }
    };

    self.onFilterChanged = function() {
      if(!self.filterChanged){
        if(self.filterEntityType != ""){
          self.filter = "Type = '" + self.filterEntityType + "'";
        }
        if(self.filterEntityName != ""){
          self.filter += " and ";
          switch (self.filterEntityType){
            case "object":
              self.filter += "ObjectName = '" + self.filterEntityName + "'";
              break;
            case "action":
              self.filter += "ActionName = '" + self.filterEntityName + "'";
              break;
            case "query":
              self.filter += "QueryName = '" + self.filterEntityName + "'";
              break;
          }

        }
      }
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
    
    function getLog() {
      usSpinnerService.spin('loading');
      AppLogService.getRequestsLog('requests',$stateParams.appName, self.filter, self.sort, self.paginationOptions.pageSize)
        .then(logSuccsessHandler, errorHandler);
    }

    function logSuccsessHandler(data) {
      self.gridOptions.data = data.data.data;
      self.gridOptions.totalItems = self.gridOptions.data.length;
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
