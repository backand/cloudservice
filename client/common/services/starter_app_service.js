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
          name: "To Do with Users",
          image: "assets/images/app_templates/to_do.png",
          description: "This starter demonstrates using our authentication and sign-up systems to work with a To-Do List app"
        },
        {
          name: "Back& CRUD",
          image: "assets/images/app_templates/backand_store.png",
          description: "This starter app demonstrates building a model with Create, Read, Update, and Delete functionality"
        },
        {
          name: "Back& Payments",
          image: "assets/images/app_templates/to_do.png",
          description: "This starter demonstrates connecting Back& application to a payment processor"
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
        name: "Back& Users",
        image: "assets/images/app_templates/to_do.png",
        description: "This starter for Angular 2 demonstrates using our authentication and sign-up systems"
      },
      {
        name: "Back& Users and CRUD",
        image: "assets/images/app_templates/backand_store.png",
        description: "This starter app demonstrates building an app using a basic CRUD model and user authentication, on top of Angular 2"
      }];
      optionsHash[ 'Ionic' ] = [
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
          name: "Ionic Starter with Social",
          image: "assets/images/app_templates/to_do.png",
          description: "This starter demonstrates using our social media authentication capabilities"
        },
        {
          name: "Ionic Chat Starter",
          image: "assets/images/app_templates/backand_store.png",
          description: "This starter app demonstrates building a chat app using sockets through Backand's SDK"
        }
      ];
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
        name: "Ionic 2 Back& Starter",
        image: "assets/images/app_templates/to_do.png",
        description: "This starter demonstrates a simple integration with Back& using a lightweight 'ToDo' list management app"
      }];
      optionsHash[ 'React' ] = [
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
        }
      ];
      optionsHash[ 'React Native' ] = [
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
        }
      ];
      return optionsHash[platformName];
    };
  }

})();
