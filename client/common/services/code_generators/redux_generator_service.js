(function () {
  'use strict';
  angular.module('common.services')
    .service('ReduxGeneratorService', [ReduxGeneratorService]);
  function ReduxGeneratorService() {
    var self = this;

    var chosen;
    var dictionary = {
      object: {
        GET: {
          name: 'get',
          parameters: ['object', 'params'],
          details: {}
        },
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
      // console.log(httpObject);
      // console.log(opts);
      httpObject = angular.fromJson(httpObject);

      chosen = {};
      var result = '';
      result = result.concat(__extractFunction__(httpObject));
      return result
    }

    function __extractFunction__ (httpObject) {
      var splitUrl = httpObject.url.split('/');

      if (splitUrl.indexOf('action') !== -1) {
        return "import backand from '@backand/vanilla-sdk'\n\n" + 'Use Vanilla syntax'
      }
      else if (splitUrl.indexOf('query') !== -1) {
        return "import backand from '@backand/vanilla-sdk'\n\n" + 'Use Vanilla syntax'
      }
      else if (splitUrl.indexOf('function') !== -1) {
        return "import backand from '@backand/vanilla-sdk'\n\n" + 'Use Vanilla syntax'
      }
      else {
        chosen = dictionary['object'][httpObject.method];
        __extractFunctionDetails__(splitUrl, httpObject);
        var camel = chosen.name + chosen.details['object'].charAt(0).toUpperCase() + chosen.details['object'].substr(1).toLowerCase();
        return 'import { ' + camel + " } from './user/userActions'\n\n" +
        'store.dispatch(' + camel + __fixParameters__() + ')'
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

      for (var i = 1; i < chosen.parameters.length; i++) {
        _parameters = _parameters.concat(angular.toJson(chosen.details[chosen.parameters[i]], true) || '');
        if (chosen.details[chosen.parameters[i + 1]]) {
          _parameters = _parameters.concat(', ');
        }
      }

      return _parameters.concat(')');
    }
  }
}());
