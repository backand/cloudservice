(function () {

  function TodoService($http, Backand) {

    var self = this;
    var baseUrl = '/1/objects/';

    self.objectName = null;

    self.readAll = function () {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + baseUrl + self.objectName
      }).then(function(response) {
        return response.data.data;
      });
    };

    self.readOne = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + baseUrl + self.objectName + '/' + id
      }).then(function(response) {
        return response.data;
      });
    };

    self.create = function (data) {
      return $http({
        method: 'POST',
        url : Backand.getApiUrl() + baseUrl + self.objectName,
        data: data,
        params: {
          returnObject: true
        }
      }).then(function(response) {
        return response.data;
      });
    };

    self.update = function (id, data) {
      return $http({
        method: 'PUT',
        url : Backand.getApiUrl() + baseUrl + self.objectName + '/' + id,
        data: data
      }).then(function(response) {
        return response.data;
      });
    };

    self.delete = function (id) {
      return $http({
        method: 'DELETE',
        url : Backand.getApiUrl() + baseUrl + self.objectName + '/' + id
      })
    };

    self.logout = function(){
      Backand.signout();
    }

  }

  angular.module('mytodoApp')
    .service('TodoService', ['$http', '$cookieStore', 'Backand', TodoService]);
}());
