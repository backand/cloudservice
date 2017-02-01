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
          parameters: ['object', 'params'],
          details: {}
        }, {
          name: 'getOne',
          parameters: ['object', 'id', 'param'],
          details: {}
        }],
        POST: {
          name: 'create',
          parameters: ['object', 'data', 'params'],
          details: {}
        },
        PUT: {
          name: 'update',
          parameters: ['object', 'id', 'data', 'params'],
          details: {}
        },
        DELETE: {
          name: 'remove',
          parameters: ['object', 'id'],
          details: {}
        }
      },
      action: {
        GET: {
          name: 'get',
          parameters: ['object', 'action', 'params'],
          details: {}
        },
        POST: {
          name: 'post',
          parameters: ['object', 'action', 'data', 'params'],
          details: {}
        }
      },
      query: {
        GET: {
          name: 'get',
          parameters: ['name', 'params'],
          details: {}
        },
        POST: {
          name: 'post',
          parameters: ['name', 'data', 'params'],
          details: {}
        }
      }
    };
    var extractionRules = {
      name: ['url'],
      object: ['url', '>?'],
      action: ['url', '<='],
      id: ['url', '>?'],
      data: ['obj'],
      params: ['obj']
    }


    self.generateCode = function (httpObject, opts) {
      console.log(httpObject);
      console.log(opts);

      chosen = {};
      httpObject = angular.fromJson(httpObject);
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
        __extractFunctionDetails__(splitUrl, httpObject);
        return '.object.action.' + chosen.name + __fixParameters__()
      }
      else if (splitUrl.indexOf('query') !== -1) {
        chosen = dictionary['query'][httpObject.method];
        __extractFunctionDetails__(splitUrl, httpObject);
        return '.query.' + chosen.name + __fixParameters__()
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
        __extractFunctionDetails__(splitUrl, httpObject);
        return '.object.' + chosen.name + __fixParameters__()
      }
    }

    function __extractFunctionDetails__ (splitUrl, httpObject) {
      for (var i = chosen.parameters.length - 1; i > -1 ; i--) {
        var _detail;
        for (var j = 0; j < extractionRules[chosen.parameters[i]].length; j++) {
          var _rule = extractionRules[chosen.parameters[i]][j];
          if(_rule === 'obj') {
            _detail = httpObject[chosen.parameters[i]];
          }
          else if (_rule === 'url') {
            _detail = splitUrl.pop();
          }
          else {
            var _pos = _detail.indexOf(_rule[1]);
            if (_pos !== -1) {
              _rule[0] === '>' ?
              _detail = _detail.slice(0, _pos) :
              _detail = _detail.slice(_pos + 1);
            }
          }
          chosen.details[chosen.parameters[i]] = _detail;
        }
      }
    }

    function __fixParameters__ () {
      var _parameters = '(';

      for (var i = 0; i < chosen.parameters.length; i++) {
        _parameters = _parameters.concat(angular.toJson(chosen.details[chosen.parameters[i]], true) || '');
        if (chosen.details[chosen.parameters[i + 1]]) {
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
