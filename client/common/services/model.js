(function() {
  'use strict';

  function ModelService(CONSTS, $http, $localStorage, $q) {

    var self = this;

    self.get = function (appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/model',
        headers: { AppName: appName }
      });
    };

    self.update = function (appName, schema) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/model',
        headers: { AppName: appName },
        data: {newSchema: schema, severity: 0}
      });
    };

    self.validate = function (appName, schema, oldSchema) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/model/validate',
        headers: { AppName: appName },
        data: {newSchema: schema, oldSchema: oldSchema, severity: 0}
      });
    };

    self.defaultSchema = function(){
      var schema = [
        {
          "name": "items",
          "fields": {
            "name": {"type": "string"},
            "description": {"type": "text"},
            "user": {
              "object": "users"
            }
          }
        },
        {
          "name": "users",
          "fields": {
            "email": {"type": "string"},
            "firstName": {"type": "string"},
            "lastName": {"type": "string"},
            "items": {
              "collection": "items",
              "via": "user"
            }
          }
        }
      ];
      return schema;
    };

    self.usingDefaultSchema = function(appName, force){

      //if force read check otherwise get from local storage
      if (!$localStorage.backand[appName]) {
        $localStorage.backand[appName] = {}
      }

      if(force || $localStorage.backand[appName].useDefaultSchema === undefined) {
        //get the model and compare to default schema
        return self.get(appName).then(
            function(data){
              $localStorage.backand[appName].useDefaultSchema = angular.equals(data.data, self.defaultSchema());
              return $localStorage.backand[appName].useDefaultSchema;
            }
        );
      } else {
        var deferred = $q.defer();
        deferred.resolve($localStorage.backand[appName].useDefaultSchema);
        return deferred.promise;
      }

    }

  }

  angular.module('common.services')
    .service('ModelService',['CONSTS', '$http','$localStorage','$q', ModelService]);

})();
