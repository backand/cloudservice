(function () {

  angular.module('common.services')
    .service('FilesService', ['CONSTS', '$http', FilesService]);

  function FilesService(CONSTS, $http) {
    var self = this;

    self.get = function (appName, path) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/files/folder',
        headers: {AppName: appName},
        params: {
          path: path
        }
      });
    };

    self.upload = function (filename, filedata, appName) {
      return $http({
        method: 'POST',
        url : CONSTS.appUrl + '/1/file/',
        headers: {
          'Content-Type': 'application/json',
          AppName: appName
        },
        data: {
          "filename": filename,
          "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
        }
      });
    }

    self.delete = function(filename, appName){
      return $http({
        method: 'DELETE',
        url : CONSTS.appUrl + '/1/file/',
        headers: {
          'Content-Type': 'application/json',
          AppName: appName
        },
        data: {
          "filename": filename
        }
      });
    }
  }


}());
