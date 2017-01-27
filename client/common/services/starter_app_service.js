(function () {
  'use strict';

  angular.module('common.services')
    .service('StarterAppService', ['$http', 'CONSTS', StarterAppService]);

  function StarterAppService($http, CONSTS) {

    var self = this;

    self.get = function (platformName) {
      var optionsHash = {};
      optionsHash[ 'RESTful API' ] = [
        {
          name: "Existing Project",
          image: "assets/images/app_templates/blank_project.png",
          description: "An awesome project",
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
        },
        {
          name: "Blank Project",
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
      optionsHash[ 'AngularJS' ] = [
        {
          name: "Existing Project",
          image: "assets/images/app_templates/blank_project.png",
          description: "An awesome project",
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
        },
        {
          name: "Blank Project",
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
      optionsHash[ 'Angular 2' ] = [{
        name: "Existing Project",
        image: "assets/images/app_templates/blank_project.png",
        description: "An awesome project",
        images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
      },
      {
        name: "Blank Project",
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
      }];
      optionsHash[ 'Ionic' ] = [{
        name: "Existing Project",
        image: "assets/images/app_templates/blank_project.png",
        description: "An awesome project",
        images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
      },
      {
        name: "Blank Project",
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
      }];
      optionsHash[ 'Ionic 2' ] = [{
        name: "Existing Project",
        image: "assets/images/app_templates/blank_project.png",
        description: "An awesome project",
        images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
      },
      {
        name: "Blank Project",
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
      }];
      optionsHash[ 'React' ] = [{
        name: "Existing Project",
        image: "assets/images/app_templates/blank_project.png",
        description: "An awesome project",
        images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
      },
      {
        name: "Blank Project",
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
      }];
      optionsHash[ 'React Native' ] = [{
        name: "Existing Project",
        image: "assets/images/app_templates/blank_project.png",
        description: "An awesome project",
        images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
      },
      {
        name: "Blank Project",
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
      }];
      console.log(optionsHash[platformName]);
      return optionsHash[platformName];
    };
  }

})();
