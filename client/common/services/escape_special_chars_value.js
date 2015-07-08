(function () {

  angular.module('common.services')
    .value('EscapeSpecialChars', function EscapeSpecialChars(obj) {
      var escapedObj = angular.copy(obj);
      _.forOwn(escapedObj, function (value, key) {
        if (typeof value === 'string') {
          escapedObj[key] = value
            .replace(/%/g, "%25")
            .replace(/\+/g, "%2B");
        }
      });
      return escapedObj;
    })

})();
