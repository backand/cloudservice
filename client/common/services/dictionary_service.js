(function () {

    function DictionaryService () {

      var self= this;
      var baseUrl = '1/table/dictionary';

      self.appName = null;
      self.tableId = null;
      self.tableName = null;



    }

    angular.module('app')
        .service('DictionaryService',[, DictionaryService])
}());
