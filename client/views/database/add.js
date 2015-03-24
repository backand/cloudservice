(function () {
  'use strict';
  angular.module('app')
    .controller('TablesAdd', ['$scope', '$state', '$rootScope', 'AppsService', 'usSpinnerService', 'NotificationService', 'TablesService','$analytics', TablesAdd]);


  function TablesAdd($scope, $state, $rootScope, AppsService, usSpinnerService, NotificationService, TablesService,$analytics) {
    var self = this;

    (function init() {
      /*[{name:"tbl11",fields:[{name:"name",type:"sorttext"}]},{name:"tbl2",fields:[{name:"name",type:"singleselect",relatedtable:"tbl11"}]}]*/
      self.tableTemplate1 =
        [
          {
            name: "user",
            fields: [{name: "username", type: "ShortText"}, {name: "password", type: "ShortText"}, {
              name: "name",
              type: "ShortText"
            }, {name: "email", type: "ShortText"}, {name: "is_approved", type: "Boolean"}, {
              name: "details",
              type: "LongText"
            }]
          }
          , {
          name: "product",
          fields: [{name: "name", type: "ShortText"}, {
            name: "type",
            type: "SingleSelect",
            relatedTable: "product_type"
          }, {name: "memory_spec", type: "Numeric"}, {name: "num_of_playes", type: "Numeric"}, {
            name: "description",
            type: "LongText"
          }, {name: "price", type: "Numeric"}]
        }
          , {
          name: "user_order",
          fields: [{name: "user_id", type: "SingleSelect", relatedTable: "user"}, {
            name: "status",
            type: "SingleSelect",
            relatedTable: "order_status"
          }, {name: "order_date", type: "DateTime"}]
        }
          , {
          name: "order_item",
          fields: [{name: "order_id", type: "SingleSelect", relatedTable: "user_order"}, {
            name: "product_id",
            type: "SingleSelect",
            relatedTable: "product"
          }]
        }
        ];
      self.tableTemplate2 = [
        {
          name: "email_campaign"
          , fields: [{name: "product_category_code", type: "ShortText"}
          , {name: "campaign_name", type: "ShortText"}
          , {name: "start_date", type: "DateTime"}
          , {name: "end_date", type: "DateTime"}
          , {name: "target_population", type: "LongText"}
          , {name: "objective", type: "LongText"}
        ]
        }
        , {
          name: "payment_method",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "description", type: "LongText"}
          ]
        }
        , {
          name: "customer",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "payment_method_id", type: "SingleSelect", relatedTable: "payment_method"}
            , {name: "phone", type: "ShortText"}
            , {name: "email", type: "ShortText"}
            , {name: "address", type: "ShortText"}
            , {name: "login", type: "ShortText"}
            , {name: "password", type: "ShortText"}
            , {name: "details", type: "LongText"}
          ]
        }
        , {
          name: "campaign_outcome",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "description", type: "LongText"}
          ]
        }
        , {
          name: "campaign_customer",
          fields: [
            {name: "customer_id", type: "SingleSelect", relatedTable: "customer"}
            , {name: "email_campaign_id", type: "SingleSelect", relatedTable: "email_campaign"}
            , {name: "campaign_outcome_id", type: "SingleSelect", relatedTable: "campaign_outcome"}
          ]
        }
        , {
          name: "order_status",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "description", type: "LongText"}
          ]
        }
        , {
          name: "shipping_method",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "shipping_charges", type: "Numeric"}
          ]
        }

        , {
          name: "customer_order",
          fields: [
            {name: "customer_id", type: "SingleSelect", relatedTable: "customer"}
            , {name: "order_status_id", type: "SingleSelect", relatedTable: "order_status"}
            , {name: "shipping_method_id", type: "SingleSelect", relatedTable: "shipping_method"}
            , {name: "create_date", type: "DateTime"}
            , {name: "delivered_date", type: "DateTime"}
            , {name: "shipping_charges", type: "Numeric"}
            , {name: "details", type: "LongText"}
          ]
        }
        , {
          name: "product_category",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "description", type: "LongText"}
          ]
        }
        , {
          name: "product",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "product_category_id", type: "SingleSelect", relatedTable: "product_category"}
            , {name: "details", type: "LongText"}
          ]
        }
        , {
          name: "item_status",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "description", type: "LongText"}
          ]
        }
        , {
          name: "order_product",
          fields: [
            {name: "product_id", type: "SingleSelect", relatedTable: "product"}
            , {name: "customer_order_id", type: "SingleSelect", relatedTable: "customer_order"}
            , {name: "item_status_id", type: "SingleSelect", relatedTable: "item_status"}
            , {name: "quantity", type: "Numeric"}
          ]
        }
      ];

      self.tableTemplate3 = [
        {
          name: "channel_type",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "description", type: "LongText"}
          ]
        }, {
          name: "channel",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "description", type: "LongText"}
            , {name: "channel_type_id", type: "SingleSelect", relatedTable: "channel_type"}

          ]
        }, {
          name: "agency",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "description", type: "LongText"}
          ]
        }, {
          name: "marketing_campaign",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "description", type: "LongText"}


          ]
        }, {
          name: "advertisement",
          fields: [
            {name: "agency_id", type: "SingleSelect", relatedTable: "agency"}
            , {name: "marketing_campaign_id", type: "SingleSelect", relatedTable: "marketing_campaign"}
            , {name: "channel_id", type: "SingleSelect", relatedTable: "channel"}

          ]
        }, {
          name: "response",
          fields: [
            {name: "advertisement_id", type: "SingleSelect", relatedTable: "advertisement"}
            , {name: "response_tag_id", type: "SingleSelect", relatedTable: "response_tag"}
          ]
        }, {
          name: "invoice_status",
          fields: [
            {name: "name", type: "ShortText"}
            , {name: "description", type: "LongText"}

          ]
        }
        , {
          name: "invoice",
          fields: [
            {name: "agency_id", type: "SingleSelect", relatedTable: "agency"}
            , {name: "client_id", type: "SingleSelect", relatedTable: "client"}
            , {name: "invoice_status_id", type: "SingleSelect", relatedTable: "invoice_status"}
          ]
        }
      ];

      self.tableTemplate4 =
        [
          {
            name: "items",
            fields: [
              {name: "name", type: "ShortText"},
              {name: "description", type: "LongText"}
            ]
          }
        ];

      self.activeTemplate = 4;
      self.templates = [
        {name: "Create your own", template: self.tableTemplate4, active: 4},
        {name: "Game Shop", template: self.tableTemplate1, active: 1},
        {name: "E-commerce Campaign", template: self.tableTemplate2, active: 2},
        {name: "Advertising System", template: self.tableTemplate3, active: 3}];

      self.isEmptyDb = false;
      self.isReady = false;
      checkForExistingTables();
    }());

    function checkForExistingTables() {
      AppsService.appDbStat($state.params.name)
        .then(function(data){
          self.isEmptyDb = data.data.tableCount == 0;
        })
    }

    self.stringfy = function (obj) {
      return angular.toJson(obj, true);
    }

    self.tableTemplate = self.stringfy(self.tableTemplate4);

    self.add = function () {
      var table = null;
      try {
        var tables = JSON.parse(self.tableTemplate);
      }
      catch (err) {
        NotificationService.add('error', 'JSON is not properly formatted');
      }
      if (tables != null) {
        try {
          NotificationService.add('info', 'The process takes 5-7 minutes');
          self.processing = true;
          /* $timeout(function(){self.processing = false;}, 2000);*/
          TablesService.addSchema($state.params.name, self.tableTemplate)
            .then(function (data) {
              $analytics.eventTrack('addedDbTables',{tempate:!0});
              NotificationService.add('success', 'The app is ready with the new tables');
              self.processing = false;
              self.isReady = true;
              //broadcast to NAV
              $rootScope.$broadcast('fetchTables');
              self.isEmptyDb = false;
              checkForExistingTables();
              __insp.push(['tagSession', "addSchema_" + self.activeTemplate]);
            }, function (err) {
              self.processing = false;
              NotificationService.add('error', 'Can not create table ' + table.name);
            })
        }
        catch (err) {
          self.processing = false;
          NotificationService.add('error', err.message);
        }
      }
    }


    $scope.ace = {
      dbType: 'json',
      editors: {},
      onLoad: function(_editor) {
        $scope.ace.editors[_editor.container.id] = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    //AppsService.getCurrentApp($state.params.name)
    //  .then(function (data) {
    //    self.currentApp = data;
    //  }, function (err) {
    //    NotificationService('error', 'Can not get current app info');
    //  });



  };
}());
