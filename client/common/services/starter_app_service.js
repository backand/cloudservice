(function () {
  'use strict';

  angular.module('common.services')
    .service('StarterAppService', ['$http', 'CONSTS', StarterAppService]);

  function StarterAppService($http, CONSTS) {

    var self = this;

    self.get = function () {
      return [{
        name: "Blank Project",
        image: "assets/images/app_templates/blank_project.png",
        description: "An awesome project",
        images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
      },
        {
          name: "Seed Project",
          image: "assets/images/app_templates/seed_project.png",
          description: "An awesome project"
        },
        {
          name: "To Do",
          image: "assets/images/app_templates/to_do.png",
          description: "An awesome project"
        },
        {
          name: "Back& Store",
          image: "assets/images/app_templates/backand_store.png",
          description: "An awesome project"
        }
      ];
    };
  }

})();
