/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function ViewData($log, NotificationService, ColumnsService, $scope) {

    var self = this;
    self.title = '';
    self.sort = '';
    self.refreshOnce = false;

    this.paginationOptions = {
      pageNumber: 1,
      pageSize: 20,
      pageSizes: [20, 50, 100, 1000]
    };

    /**
     * init the data
     */
    (function init() {
      $scope.$on('tabs:data', getData);
    }());

    self.gridOptions = {
      enableColumnResize: true,
      enablePaginationControls: false,
      useExternalSorting: true,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        //declare the events

        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
          self.sort = '[{fieldName:"' + sortColumns[0].name + '", order:"' + sortColumns[0].sort.direction + '"}]';
          getData();
        });
      }
    };

    $scope.$on('grid:init', function () {
      //self.gridOptions.columnDefs[0].visible = false;
    });

    $scope.$watch('data.paginationOptions.pageNumber', getData)

    function getData() {
      if (self.gridOptions.data.length == 0) {
        ColumnsService.getData(self.paginationOptions.pageSize, self.paginationOptions.pageNumber, self.sort).then(successHandler, errorHandler);
        self.refreshOnce = false;
      }
      else
      {
        if($scope.gridApi.grid.options.columnDefs[0].name == '__metadata')
          $scope.gridApi.grid.options.columnDefs.splice(0,1);
        if(!self.refreshOnce){
          setTimeout("$('#grid-container').trigger('resize')", 1); //resize the tab to fix the width issue with UI grid
          self.refreshOnce = true;
        }
      }
    }

    function successHandler(data) {
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


  function onCompile() {
    return {
      priority: 9009,
      link: function (scope) {
        scope.$root.$broadcast('grid:init')
      }
    }
  }


  angular.module('app')
    .directive('onCompile', onCompile)
    .controller('ViewData', [
      '$log',
      'NotificationService',
      'ColumnsService',
      '$scope',
      ViewData
    ]);

}());
