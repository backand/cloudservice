(function () {
  'use strict';
  angular.module('common.services')
    .service('VanillaGeneratorService', [VanillaGeneratorService]);
  function VanillaGeneratorService() {
    var self = this;

    var chosen;
    var dictionary = {
      object: {
        GET: [{
          name: 'getList',
          params: ['object', 'options'],
          details: {}
        }, {
          name: 'getOne',
          params: ['object', 'id', 'options'],
          details: {}
        }],
        POST: {
          name: 'create',
          params: ['object', 'data', 'options', 'parameters'],
          details: {}
        },
        PUT: {
          name: 'update',
          params: ['object', 'id', 'data', 'options', 'parameters'],
          details: {}
        },
        DELETE: {
          name: 'remove',
          params: ['object', 'id', 'parameters'],
          details: {}
        }
      },
      action: {
        GET: {
          name: 'get',
          params: ['object', 'action', 'parameters'],
          details: {}
        },
        POST: {
          name: 'post',
          params: ['object', 'action', 'data', 'parameters'],
          details: {}
        }
      },
      query: {
        GET: {
          name: 'get',
          params: ['name', 'parameters'],
          details: {}
        },
        POST: {
          name: 'post',
          params: ['name', 'parameters'],
          details: {}
        }
      },
      "function": {
        GET: {
          name: 'get',
          params: ['name', 'parameters'],
          details: {}
        },
        POST: {
          name: 'post',
          params: ['name', 'data', 'parameters'],
          details: {}
        }
      }
    };
    var extractionMethods = {
      name: function(splitUrl, httpObject) {
        var param = splitUrl.pop();
        if(param.indexOf('?') !== -1) {
          param = param.slice(0, param.indexOf('?'));
        }
        return param;
      },
      object: function(splitUrl, httpObject) {
        var param = splitUrl.pop();
        return param.slice(0, param.indexOf('?'));
      },
      action: function(splitUrl, httpObject) {
        var param = splitUrl.pop();
        return param.slice(param.indexOf('=') + 1);
      },
      id: function(splitUrl, httpObject) {
        var param = splitUrl.pop();
        return param.slice(0, param.indexOf('?'));
      },
      data: function(splitUrl, httpObject) {
        return httpObject.data;
      },
      options: function(splitUrl, httpObject) {
        httpObject.params && httpObject.params.parameters && delete httpObject.params.parameters;
        return httpObject.params;
      },
      parameters: function(splitUrl, httpObject) {
        return httpObject.params && httpObject.params.parameters ? httpObject.params.parameters : undefined;
      }
    }


    self.generateCode = function (httpObject, opts) {
      console.log(httpObject);
      // console.log(opts);
      httpObject = angular.fromJson(httpObject);

      chosen = {};
      var result = opts.prefix;
      result = result.concat(__extractFunction__(httpObject));
      opts.type === 'promise' ?
        result = result.concat(__generatePromiseString__(opts.es6)) :
        result = 'return '.concat(result);
      return result
    }

    function __extractFunction__ (httpObject) {
      var splitUrl = httpObject.url.split('/');

      if (splitUrl.indexOf('action') !== -1) {
        chosen = dictionary['action'][httpObject.method];
        __extractFunctionParams__(splitUrl, httpObject);
        return '.object.action.' + chosen.name + __fixParameters__()
      }
      else if (splitUrl.indexOf('query') !== -1) {
        chosen = dictionary['query'][httpObject.method];
        __extractFunctionParams__(splitUrl, httpObject);
        return '.query.' + chosen.name + __fixParameters__()
      }
      else if (splitUrl.indexOf('function') !== -1) {
        chosen = dictionary['function'][httpObject.method];
        __extractFunctionParams__(splitUrl, httpObject);
        return '.fn.' + chosen.name + __fixParameters__()
      }
      else {
        if(httpObject.method === 'GET') {
          !angular.isNumber(splitUrl[splitUrl.length - 1]) ?
            chosen = dictionary['object'][httpObject.method][0] :
            chosen = dictionary['object'][httpObject.method][1];
        }
        else {
          chosen = dictionary['object'][httpObject.method];
        }
        __extractFunctionParams__(splitUrl, httpObject);
        return '.object.' + chosen.name + __fixParameters__()
      }
    }

    function __extractFunctionParams__ (splitUrl, httpObject) {
      // loop end to start over params array;
      for (var i = chosen.params.length - 1; i > -1 ; i--) {
        var _cur = chosen.params[i];
        // call current param extraction method;
        chosen.details[_cur] = extractionMethods[_cur](splitUrl, httpObject);
      }
    }

    function __fixParameters__ () {
      var _parameters = '(';
      for (var i = 0; i < chosen.params.length; i++) {
        _parameters = _parameters.concat(angular.toJson(chosen.details[chosen.params[i]], true) || '');
        if (chosen.details[chosen.params[i + 1]]) {
          _parameters = _parameters.concat(', ');
        }
      }
      return _parameters.concat(')');
    }

    function __generatePromiseString__ (es6) {
      var _then = es6 ? 'data => { }' : 'function(data) { }';
      var _catch = es6 ? 'error => { }' : 'function(error) { }';
      return '\n.then(' + _then + ')\n' +
        '.catch(' + _catch + ')'
    }
  }
}());
