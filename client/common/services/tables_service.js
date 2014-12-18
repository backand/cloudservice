(function() {
  'use strict';

  function TablesService($http, $q, CONSTS) {

    this.get = function(appName) {

      //api.backand.info:8099/1/table/config/?filter=[{fieldName:"SystemView", operator:"equals", value: false}]&sort=[{fieldName:"captionText", order:"asc"}]

      //return $http({
      //  method: 'GET',
      //  url: CONSTS.appUrl + '/admin/myAppConnection/'+appName
      //});

      var deferred = $q.defer();

      deferred.resolve({
        "totalRows": 33,
        "data": [
          {
            "__metadata": {
              "id": "161"
            },
            "fields": "Fields",
            "captionText": "Apple Store",
            "name": "v_AppleStore",
            "databaseName": "v_AppleStore",
            "securityWorkspace": "Public",
            "columnDisplayinTitle": "Id",
            "permanentFilter": "",
            "defaultSort": "",
            "gridEditable": "Yes",
            "overrideinheritable": "No",
            "systemView": "No",
            "importFromExcel": "Yes",
            "multiSelect": "Yes",
            "rowsperPage": "20",
            "hideFilter": "No",
            "openFilterasCollapsed": "Yes",
            "hideFooter": "No",
            "editableTableName": "AppleStore",
            "openDialoginMaximaize": "No"
          },
          {
            "__metadata": {
              "id": "14"
            },
            "fields": "Fields",
            "captionText": "Customers",
            "name": "Customers",
            "databaseName": "Customers",
            "securityWorkspace": "Public",
            "columnDisplayinTitle": "Company",
            "permanentFilter": "",
            "defaultSort": "",
            "gridEditable": "Yes",
            "overrideinheritable": "No",
            "systemView": "No",
            "importFromExcel": "Yes",
            "multiSelect": "Yes",
            "rowsperPage": "20",
            "hideFilter": "No",
            "openFilterasCollapsed": "No",
            "hideFooter": "No",
            "editableTableName": "",
            "openDialoginMaximaize": "No"
          },
          {
            "__metadata": {
              "id": "67"
            },
            "fields": "Fields",
            "captionText": "CustomersJob Title",
            "name": "CustomersJob_Title",
            "databaseName": "CustomersJob Title",
            "securityWorkspace": "Settings",
            "columnDisplayinTitle": "Name",
            "permanentFilter": "",
            "defaultSort": "",
            "gridEditable": "Yes",
            "overrideinheritable": "No",
            "systemView": "No",
            "importFromExcel": "No",
            "multiSelect": "No",
            "rowsperPage": "20",
            "hideFilter": "No",
            "openFilterasCollapsed": "No",
            "hideFooter": "No",
            "editableTableName": "CustomersJob Title",
            "openDialoginMaximaize": "No"
          },
          {
            "__metadata": {
              "id": "15"
            },
            "fields": "Fields",
            "captionText": "Employee Privileges",
            "name": "Employee_Privileges",
            "databaseName": "Employee_Privileges",
            "securityWorkspace": "Settings",
            "columnDisplayinTitle": "FK_Privileges_Employee_Privileges_Parent",
            "permanentFilter": "",
            "defaultSort": "",
            "gridEditable": "Yes",
            "overrideinheritable": "No",
            "systemView": "No",
            "importFromExcel": "Yes",
            "multiSelect": "No",
            "rowsperPage": "20",
            "hideFilter": "No",
            "openFilterasCollapsed": "No",
            "hideFooter": "No",
            "editableTableName": "",
            "openDialoginMaximaize": "No"
          },
          {
            "__metadata": {
              "id": "22"
            },
            "fields": "Fields",
            "captionText": "Orders Tax Status",
            "name": "Orders_Tax_Status",
            "databaseName": "Orders_Tax_Status",
            "securityWorkspace": "Settings",
            "columnDisplayinTitle": "Tax Status Name",
            "permanentFilter": "",
            "defaultSort": "",
            "gridEditable": "Yes",
            "overrideinheritable": "No",
            "systemView": "No",
            "importFromExcel": "Yes",
            "multiSelect": "No",
            "rowsperPage": "20",
            "hideFilter": "No",
            "openFilterasCollapsed": "No",
            "hideFooter": "No",
            "editableTableName": "",
            "openDialoginMaximaize": "No"
          },
          {
            "__metadata": {
              "id": "35"
            },
            "fields": "Fields",
            "captionText": "Payment Type",
            "name": "OrdersPayment_Type",
            "databaseName": "OrdersPayment Type",
            "securityWorkspace": "Settings",
            "columnDisplayinTitle": "Name",
            "permanentFilter": "",
            "defaultSort": "",
            "gridEditable": "Yes",
            "overrideinheritable": "No",
            "systemView": "No",
            "importFromExcel": "No",
            "multiSelect": "No",
            "rowsperPage": "20",
            "hideFilter": "No",
            "openFilterasCollapsed": "No",
            "hideFooter": "No",
            "editableTableName": "OrdersPayment Type",
            "openDialoginMaximaize": "No"
          }
        ]
      });

      return deferred.promise;
    };
  }

  angular.module('common.services')
    .service('TablesService', ['$http', '$q', 'CONSTS', TablesService]);
})();
