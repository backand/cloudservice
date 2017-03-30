(function () {


  angular.module('backand')
    .controller('ObjectDataController', [
      'NotificationService',
      'ColumnsService',
      'DataService',
      '$scope',
      '$modal',
      'usSpinnerService',
      'tableName',
      'ConfirmationPopup',
      'LocalStorageService',
      '$filter',
      '$state',
      'TablesService',
      '$stateParams',
      '$rootScope',
      'AppsService',
      '$localStorage',
      '$window',
      ObjectDataController
    ]);

  function ObjectDataController(NotificationService,
                                ColumnsService,
                                DataService,
                                $scope,
                                $modal,
                                usSpinnerService,
                                tableName,
                                ConfirmationPopup,
                                LocalStorageService,
                                $filter,
                                $state,
                                TablesService,
                                $stateParams,
                                $rootScope,
                                AppsService,
                                $localStorage,
                                $window) {

    var self = this;
    self.currentApp = AppsService.currentApp;
    self.tableName = tableName;
    self.title = '';
    self.sort = '';
    self.refreshOnce = false;
    self.httpRequestsLog = DataService.log = [];
    self.showLog = $state.params.showLog === 'false' ? false : $state.params.showLog;
    self.logIndex = DataService.logIndex;
    self.backandstorage = $localStorage.backand[self.currentApp.Name];
    $rootScope.$on('SyncSuccess', function () {
      self.filterData();
    });

    this.paginationOptions = {
      pageNumber: 1,
      pageSize: 20,
      pageSizes: [20, 50, 100, 1000]
    };

    (function init() {
      initDefaultFilter();
      if (self.defaultFilter) {
        ColumnsService.get(true)
          .then(successColumnsHandlerWithDefaultFilter, errorHandler);
      } else {
        getData(true, true);
      }
    }());

    //Function to set and show which index is chosen
    self.getLogIndex = function(a){
        if (a !== -1) {
          self.logIndex.last = a;
          self.backandstorage.httpLogIndex = a;
        }
        if(self.pinme == false){
        self.showMe();
      }
    }
    self.toggleSearch = function () {

            if (self.showme) {
                
            } 
        };
   
   function closeSearchWhenClickingElsewhere(event) {

            var clickedElement = event.target;
            if (!clickedElement) return;

            var clickedOnDropDown = (clickedElement.parentElement.classList.contains('table'));
            var clickedOnButton = (clickedElement.classList.contains('http-dropdownbutn'));
            if (!clickedOnDropDown && !clickedOnButton) {
                self.showme = false;
            }

        }
//         $window.onclick = function (event) {
//                    closeSearchWhenClickingElsewhere(event);
//                };
   
   //Function to receive pin status, if no pin default is pinned.
    self.getPinToLocalStorage = function() {
        if (self.backandstorage.pinned !== false && self.backandstorage.pinned !== true) {
            self.backandstorage.pinned = true;
           }
          return(self.backandstorage.pinned)
        }
    self.getHttpLogLocalStorage = function(){
      if(!self.backandstorage.httpLogIndex)
      {
        self.backandstorage.httpLogIndex = 0;
      }
      return(self.backandstorage.httpLogIndex)
    }
    self.showme = false;
    self.pinme = self.getPinToLocalStorage();
    self.logIndex.last = self.getHttpLogLocalStorage();
    //Show drop down http log
    self.showMe = function(){
      if(self.showme == false){
        self.showme = true  
      }
      else{
        self.showme = false
      }
    }
    //Pin http log to the right or dropdown.
    self.pinMe = function(){
       if(self.pinme == false){
        self.pinme = true;
        self.backandstorage.pinned = true;
        self.showme = false;  
      }
      else{
        self.pinme = false;
        self.backandstorage.pinned = false;
      };
    }
    self.toggleShowLog = function () {
      self.showLog = !self.showLog;
      $state.go('.', {showLog: self.showLog}, {notify: false});
      resizeGrid();
    };

    self.gotoNextLogItem = function () {
      if (self.httpRequestsLog[self.logIndex.last + 1]) {
        self.logIndex.last++;
      }
    };

    self.gotoPrevLogItem = function () {
      if (self.httpRequestsLog[self.logIndex.last - 1]) {
        self.logIndex.last--;
      }
    };

    self.toggleShowFilter = function () {
      if (self.filterReady) {
        self.showFilter = !self.showFilter;
      }
    };
    //adding if pinned to local storage
    self.storage = LocalStorageService.getLocalStorage();
    self.storage = $localStorage.backand[self.currentApp.Name];


    self.createData = function (data) {
      DataService.post(tableName, data, true);
    };

    self.refresh = function () {
      self.filterData();
    };

    self.gridOptions = {
      enablePaginationControls: false,
      useExternalSorting: true,
      excludeProperties: '__metadata',
      multiSelect: true,
      excessColumns: 20,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        //declare the events

        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
          if (sortColumns[0]) {
            self.sort = [{
              fieldName: sortColumns[0].name,
              order: sortColumns[0].sort.direction
            }];
          }
          else {
            self.sort = '';
          }
          self.filterData();
        });
      }
    };
    self.selectedOption = {
      $$hashKey : "object:111"
    }
    $scope.$watchGroup([
        'ObjectData.paginationOptions.pageNumber',
        'ObjectData.paginationOptions.pageSize']
      , getPageData);

    function getPageData(newVal, oldVal) {
      if (newVal !== oldVal) {
        self.filterData();
      }
    }

    function getData(force, log) {
      usSpinnerService.spin("loading-data");

      ColumnsService.get(force)
        .then(successColumnsHandler, errorHandler)
        .then(function () {
          return loadData(log);
        })
        .then(successDataHandler, errorHandler);
    }

    function loadData(log) {
      return DataService.get(self.tableName, self.paginationOptions.pageSize, self.paginationOptions.pageNumber, self.sort, null, log);
    }

    function successColumnsHandler(data) {
      self.columnDefs = data.fields;
      getFilterOptions();
      getEditRowData();
    }

    function successColumnsHandlerWithDefaultFilter(data) {
      successColumnsHandler(data);
      self.filterData();
      self.showFilter = true;
    }

    function successDataHandler(response) {
      self.gridOptions.totalItems = response.data.totalRows;

      self.gridOptions.data = response.data.data;
      var columns = [];
      if (response.data.data.length > 0) {
        columns = _.without(Object.keys(response.data.data[0]), '__metadata');
      } else {
        columns = _.pluck(self.columnDefs, 'name');
      }

      fixDatesInData();

      self.gridOptions.columnDefs = columns.map(function (column) {
        var columnInfo = _.find(self.columnDefs, {name: column});

        return {
          minWidth: 80,
          name: column,
          displayName: column,
          cellTemplate: getCellEditTemplate(columnInfo)
        }
      });

      addActionColumns();

      if (_.last(self.gridOptions.columnDefs))
        _.last(self.gridOptions.columnDefs).minWidth = 286; //for edit widget to be shown properly

      setTimeout(refreshGridDisplay(), 1); //fix bug with bootstrap tab and ui grid
      usSpinnerService.stop("loading-data");
    }

    function addActionColumns() {

      var actionColumnOptions = {
        width: 30,
        displayName: '',
        enableSorting: false,
        enableColumnMenu: false
      };

      var editColumnOptions = {
        name: 'edit',
        cellTemplate: '<div class="grid-icon" ng-click="grid.appScope.ObjectData.editRow($event, row)"><i class="ti-pencil"/></div>'
      };
      angular.extend(editColumnOptions, actionColumnOptions);
      self.gridOptions.columnDefs.unshift(editColumnOptions);
    }

    function refreshGridDisplay() {
      if (!self.refreshOnce) {
        resizeGrid();
        self.refreshOnce = true;
      }
    }

    this.pageMax = function (pageSize, currentPage, max) {
      return Math.min((pageSize * currentPage), max);
    };

    function errorHandler(error, message) {
      usSpinnerService.stop("loading-data");
      NotificationService.add('error', message);
    }

    function getCellEditTemplate(column) {
      if (column.form.hideInEdit || column.form.disableInEdit || column.advancedLayout.excludeInUpdate) return undefined;

      var callbackOptions = ' onbeforesave="grid.appScope.ObjectData.onUpdateRowCell(row, col, $data)"';

      var type = getFieldType(column.type);

      if (type === 'multiSelect') {
        return '<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="" ng-click="grid.appScope.ObjectData.goToCollection(row, col)">' + column.relatedViewName + '</a></div>';
      }

      if (type == 'dateTime')
        return '<div class="ui-grid-cell-contents"><span editable-date="MODEL_COL_FIELD" class="editable-grid-cell" '
          + callbackOptions
          + '>{{COL_FIELD | date:"MM/dd/yyyy" CUSTOM_FILTERS }}</span> '
          + '<span editable-bstime="MODEL_COL_FIELD" e-show-meridian="false" class="editable-grid-cell" '
          + callbackOptions
          + '>{{COL_FIELD | date:"HH:mm:ss" CUSTOM_FILTERS }}</span></div>';

      if (type === 'singleSelect') {

        return '<div class="ui-grid-cell-contents" editable-text="MODEL_COL_FIELD" '
          + 'e-typeahead="item.__metadata.id as grid.appScope.ObjectData.getSingleSelectLabel(item, col) '
          + 'for item in grid.appScope.ObjectData.getSingleAutocomplete(col, $viewValue)" '
          + 'e-typeahead-template-url="views/tables/data/select_row_template.html" '
          + 'e-typeahead-editable="false" ' + callbackOptions
          + '>{{COL_FIELD CUSTOM_FILTERS}}</div>';
      }

      if (type === 'numeric') {
        type = 'text';
      } // todo: fix single-select
      // Search of Multi-Select keys doesn't work currently
      /*if (!_.isEmpty(column.relatedViewName)) {
       return '<div class="ui-grid-cell-contents" editable-text="MODEL_COL_FIELD" ' +
       'e-typeahead="item.value as item.value + \'. \' + item.label ' +
       'for item in grid.appScope.ObjectData.getAutocomplete(col.field, $viewValue)" '
       + callbackOptions
       + '>{{COL_FIELD CUSTOM_FILTERS}}</div>';
       }*/

      return '<div class="ui-grid-cell-contents" editable-' + type + '="MODEL_COL_FIELD" '
        + callbackOptions
        + '>{{COL_FIELD CUSTOM_FILTERS}}</div>';
    }

    self.getSingleAutocomplete = function (item, query) {
      return DataService.search(self.relatedViews[item.field].object, query)
        .then(function (result) {
          results = $filter('orderBy')(result.data.data, '__matadata.id');
          return results;
        });
    };


    self.getAutocomplete = function (columnName, term) {
      return DataService.getAutocomplete(self.tableName, columnName, term)
        .then(function (result) {
          results = $filter('orderBy')(result.data, 'value');
          return results;
        });
    };

    self.getSingleSelectLabel = function (row, col) {
      if (typeof row !== 'object')
        return row;

      var descriptive = self.relatedViews[col.field].descriptiveColumn;
      var descriptiveLabel = row.__metadata.id + ': ' + row[descriptive];

      var fields = [];

      _.forEach(row, function (value, key) {
        if (key !== '__metadata' && key !== descriptive && !_.isEmpty(value)) {
          fields.push({key: key, value: value});
        }
      });

      return {descriptiveLabel: descriptiveLabel, fields: fields};
    };

    self.onUpdateRowCell = function (row, col, newValue) {
      var updatedObject = {};
      updatedObject[col.name] = newValue;
      var updatePromise = DataService.update(self.tableName, updatedObject, row.entity.__metadata.id, true);
      updatePromise
        .then(function () {
          return self.filterData();
        });
      return updatePromise;
    };

    function fixDatesInData() {
      self.columnDefs.forEach(function (columnDef) {
        if (columnDef.type == 'DateTime') {
          self.gridOptions.data.forEach(function (row) {
            var date = row[columnDef.name];
            row[columnDef.name] = date ? new Date(date) : '- - - - - - -';
          });
        }
      });
    }

    function getFieldType(type) {
      switch (type) {
        case 'MultiSelect':
          return 'multiSelect'; // Search of Multi-Select keys doesn't work currently
        case 'SingleSelect':
          return 'singleSelect';
        case 'Numeric':
          return 'numeric'; // Also floats, so can't use number
        case 'DateTime':
          return 'dateTime';
        case 'ShortText':
          return 'text';
        case 'LongText':
          return 'textarea';
        case 'Boolean':
          return 'checkbox';
        case 'Point':
          return 'point';
        default:
          return 'text'
      }
    }

    function getFieldTypeForFilter(type) {
      switch (type) {
        case 'MultiSelect':
          return null;
        case 'SingleSelect':
          return 'select'; // Search of Multi-Select keys doesn't work currently
        case 'ShortText':
        case 'LongText':
          return 'text';
        default:
          return type;
      }
    }

    // edit row modal

    self.newRow = function () {
      getEditRowEntity();
      openModal();
    };

    self.editRow = function (event, rowItem) {
      DataService.getItem(self.tableName, rowItem.entity.__metadata.id, true).then(function(results){
        var row = {};
        row.entity = results.data;
        getEditRowEntity(row);
        openModal();
      });

    };

    self.uploadJson = function () {
      getEditRowEntity();
      var modalInstance = $modal.open({
        templateUrl: 'views/tables/data/upload_json.html',
        controller: 'UploadJsonController as uploadJson',
        resolve: {
          tableName: function () {
            return self.tableName;
          },
          columns: function () {
            return self.editRowData.entities;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if (result && result.reopen) {
          self.newRow();
        }
        else {
          usSpinnerService.spin("loading-data");
        }
        self.filterData();
      });
    };

    function getEditRowEntity(rowItem) {
      self.editRowData.id = rowItem ? rowItem.entity.__metadata.id : null;
      self.editRowData.entities = [];
      self.editRowData.form.forEach(function (formItem) {
        // Convert date string to Date object
        if (formItem.type == 'dateTime' && rowItem) {
          rowItem.entity[formItem.key] = new Date(rowItem.entity[formItem.key]);
        }
        self.editRowData.entities.push({
          key: formItem.key,
          hide: formItem.hideInCreate && !rowItem || formItem.hideInEdit && rowItem || formItem.type === 'multiSelect',
          disable: formItem.disable || formItem.disableInCreate && !rowItem || formItem.disableInEdit && rowItem,
          required: formItem.required,
          value: rowItem ? rowItem.entity[formItem.key] : formItem.defaultValue,
          type: formItem.type,
          relatedView: formItem.relatedView
        });
      });
    }

    function resetEditRowData() {
      self.editRowData = {
        form: []
      };
      self.relatedViews = {};
    }

    function getEditRowData() {
      resetEditRowData();
      self.columnDefs.forEach(function (column) {

        var columnData = {
          disableInCreate: column.form.disableInCreate || column.advancedLayout.excludeInInsert,
          hideInCreate: column.form.hideInCreate,
          disableInEdit: column.form.disableInEdit || column.advancedLayout.excludeInUpdate,
          hideInEdit: column.form.hideInEdit,
          required: column.advancedLayout.required,
          defaultValue: column.advancedLayout.defaultValue,
          key: column.name,
          type: getFieldType(column.type)
        };

        if (!_.isEmpty(column.relatedViewName)) {
          ColumnsService.getColumns(column.relatedViewName)
            .then(function (response) {
              columnData.relatedView = {
                object: column.relatedViewName,
                descriptiveColumn: response.data.columnDisplayinTitle
              };
              self.relatedViews[column.name] = {
                object: column.relatedViewName,
                descriptiveColumn: response.data.columnDisplayinTitle
              };
            })
        }

        self.editRowData.form.push(columnData);

      });
    }

    function openModal() {
      var modalInstance = $modal.open({
        templateUrl: 'views/tables/data/edit_row.html',
        controller: 'EditRowController as EditRow',
        resolve: {
          editRowData: function () {
            return self.editRowData;
          },
          tableName: function () {
            return self.tableName;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if (result && result.reopen) {
          self.newRow();
        }
        else {
          usSpinnerService.spin("loading-data");
        }
        self.filterData();
      });
    }

    self.deleteRows = function () {
      var items = $scope.gridApi.selection.getSelectedRows();
      ConfirmationPopup.confirm('Are you sure you want to delete the selected rows?')
        .then(function (result) {
          if (!result)
            return;
          usSpinnerService.spin("loading-data");
          angular.forEach(items, function (rowItem) {
            DataService.delete(self.tableName, rowItem, rowItem.__metadata.id, true)
              .then(function () {
                return self.filterData();
              })
              .then(successDataHandler);
          });
        });
    };

    // filter data

    function getFilterOptions() {
      self.filterOptions = {
        fields: getFieldsForFilter(),
        operators: null
      };
      self.filterReady = true;
    }

    function getFieldsForFilter() {

      var fields = _.map(self.columnDefs, function (field, index) {
        var fieldData = {
          index: index,
          name: field.name,
          type: getFieldTypeForFilter(field.type),
          originalType: field.type
        };

        if (field.type === 'SingleSelect' && !_.isEmpty(field.relatedViewName)) {
          ColumnsService.getColumns(field.relatedViewName)
            .then(function (response) {
              fieldData.relatedView = {
                object: field.relatedViewName,
                descriptiveColumn: response.data.columnDisplayinTitle
              };
            })
        }
        return fieldData;
      });

      _.remove(fields, {type: null});

      if (self.defaultFilter) {
        _.remove(fields, {name: self.defaultFilter.field.name})
      }
      return fields;
    }

    self.disableValue = function (operator) {
      return ['empty', 'notEmpty'].indexOf(operator) > -1;
    };

    function filterValid(item) {
      return item.field
        && item.operator
        && (item.value || self.disableValue(item.operator));
    }

    self.filterData = function () {

      if (self.filterQuery.length === 1 && _.isEmpty(self.filterQuery[0])) {
        return getData(true, true);
      }

      usSpinnerService.spin("loading-data");

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

      return DataService.get(
        self.tableName,
        self.paginationOptions.pageSize,
        self.paginationOptions.pageNumber,
        self.sort,
        query,
        true)
        .then(successDataHandler, errorHandler);
    };

    self.goToCollection = function (row, col) {
      var id = row.entity.__metadata.id;

      var currentField = _.where(self.columnDefs, {name: col.name})[0];
      var relatedFieldName = currentField.relatedParentFieldName;
      var relatedObject = currentField.relatedViewName;
      var relatedObjectId = TablesService.getTableByName(relatedObject).__metadata.id;

      ColumnsService.getColumns(relatedObject).then(function (data) {
        var relatedField = _.where(data.data.fields, {name: relatedFieldName})[0];
        var filter = {
          field: relatedField,
          operator: 'in',
          value: id
        };
        usSpinnerService.spin('loading');

        var collection = true;
        $state.go('object_data', {
            tableName: relatedObject,
            tableId: relatedObjectId,
            defaultFilter: filter,
            collection: collection
          }).then(function () {
            usSpinnerService.stop('loading');
          });
      });

    };

    //resize the tab to fix the width issue with UI grid
    function resizeGrid() {
      setTimeout("$('#grid-container').trigger('resize');", 50);
    }

    function initDefaultFilter() {
      self.filterQuery = [];
      if ($stateParams.collection === 'true' && $stateParams.defaultFilter) {
        self.defaultFilter = $stateParams.defaultFilter;
      }
    }
  }
}());
