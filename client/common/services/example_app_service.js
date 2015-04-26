(function() {
  function ExampleAppService($http) {
    var self = this;

    self.codeFiles = [
      {name: 'index.html', type: 'html'},
      {name: 'main.html', type: 'html'},
      {name: 'main.js', type: 'javascript'},
      {name: 'todo_service.js', type: 'javascript'},
      {name: 'theme.css', type: 'css'},
      {name: 'model.json', type: 'json'}
      ];

    self.getFile = function (filename)
    {
      return $http({
        method: 'GET',
        url: 'examples/todo/' + filename
      })
    };
  }
  angular.module('common.services')
    .service('ExampleAppService', ['$http', ExampleAppService]);

})();
