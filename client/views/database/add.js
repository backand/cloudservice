(function () {
  'use strict';
  angular.module('app')
    .controller('TablesAdd', ['$scope', '$state', 'AppsService', 'usSpinnerService', 'NotificationService', 'TablesService', TablesAdd]);

  function TablesAdd($scope, $state, AppsService, usSpinnerService, NotificationService, TablesService) {
    var self = this;
    var currentApp;
    self.activeTemplate=1;
    AppsService.getCurrentApp($state.params.name)
      .then(function (data) {
        self.currentApp = data;
      }, function (err) {
        NotificationService('error', 'Can not get current app info');
      });
    //explaign that the order of the table , dependencies should be first
    /*[{name:"tbl1",fields:[{name:"name",type:"SortText"}]},{name:"tbl2",fields:[{name:"name",type:"SingleSelect",relatedTable:"tbl1"}]}]*/
    this.tableTemplate1 =
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
    this.tableTemplate2 = [
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
    this.tableTemplate3 = [
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
    this.stringfy = function (obj) {
      return angular.toJson(obj, true);
    }
    this.tableTemplate = this.stringfy(this.tableTemplate1);

    this.addTables = function (tables) {
      //if (self == null) self = this;
      if (tables.length > 0) {

        self.addTable( this.addTables, tables)

      }
      else {
        usSpinnerService.stop("loading");
        this.processing = false;
        NotificationService.add('success', 'Congratulation, Your template database is ready! ');
      }
    }
    this.addTable = function ( successcallback, tables) {
      var table = tables[0];
      tables.shift();
      var promise = TablesService.add($state.params.name, JSON.stringify(table));
      promise.then(function (data) {
        NotificationService.add('success', 'Table ' + table.name + ' was created');
        successcallback(tables);
      }, function (err) {
        this.processing = false;
        NotificationService.add('error', 'Can not create table ' + table.name);
      });
    }
    this.add = function () {
      var table = null;
      try {
        var tables = JSON.parse(this.tableTemplate);
      }
      catch (err) {
        NotificationService.add('error', 'JSON is not properly formatted');
      }
      if (tables != null) {
        try {
          NotificationService.add('info', 'Sync takes 5-7 minutes');
          this.processing = true;
          this.addTables(tables);
        }
        catch (err) {
          this.processing = false;
          NotificationService.add('error', err.message);
        }

      }
    }
    self.isEmptyDb = true;
    angular.element(document).ready(function () {
      TablesService.get($state.params.name)
        .then(function (data) {
          self.isEmptyDb = data.data.data.length==0;
        }, function(err) {

          NotificationService.add('error', 'Can not get tables list');
        });
      //if($state.params.sync === '1')
      //  $timeout(function() {
      //    $state.params.sync = 0;
      //    angular.element('#sync_button')[0].click();
      //  }, 100);
    });

  };
}());
