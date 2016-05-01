/**
 * Created by shmuela on 05/05/15.
 */
(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('VideoController', ['$modalInstance', VideoController]);

  function VideoController($modalInstance) {

    var self = this;

    self.close = function () {
      $modalInstance.close();
    };

    self.videos = [
      {
        img: "https://img.youtube.com/vi/1cAPczLvAb8/mqdefault.jpg",
        href: "https://www.youtube.com/embed/1cAPczLvAb8?rel=0&autoplay=1",
        title: "Getting Started with Back&",
        desc: ""
      },
      {
        img: "https://img.youtube.com/vi/RqsElDFAdHY/mqdefault.jpg",
        href: "https://www.youtube.com/embed/RqsElDFAdHY?rel=0&autoplay=1",
        title: "Migrating Your Parse App to Back&",
        desc: ""
      },
      {
        img: "https://img.youtube.com/vi/o5rDGBfpfxE/mqdefault.jpg",
        href: "https://www.youtube.com/embed/o5rDGBfpfxE?rel=0&autoplay=1",
        title: "How to use Back& database editor",
        desc: ""
      },
      {
        img: "https://img.youtube.com/vi/5C7hd3Z6qcE/mqdefault.jpg",
        href: "https://www.youtube.com/embed/5C7hd3Z6qcE?rel=0&autoplay=1",
        title: "Back& live coding at the AWS Loft in San Francisco",
        desc: ""
      },
      {
        img: "https://img.youtube.com/vi/zrFpUdPn38Q/mqdefault.jpg",
        href: "https://www.youtube.com/embed/zrFpUdPn38Q?rel=0&autoplay=1",
        title: "Building a hybrid app in less than an hour with Ionic and Back&",
        desc: ""
      },
      {
        img: "https://img.youtube.com/vi/CEsndv0Lmaw/mqdefault.jpg",
        href: "https://www.youtube.com/embed/CEsndv0Lmaw?rel=0&autoplay=1",
        title: "How to build server side logic using Backand's Actions",
        desc: ""
      },
      {
        img: "https://img.youtube.com/vi/PDo-MeUmoVY/mqdefault.jpg",
        href: "https://www.youtube.com/embed/PDo-MeUmoVY?rel=0&autoplay=1",
        title: "How to query your data using Backand",
        desc: ""
      },
      //{
      //  img: "https://img.youtube.com/vi/KG3rL1xHEg4/mqdefault.jpg",
      //  href: "https://www.youtube.com/embed/KG3rL1xHEg4?rel=0&autoplay=1",
      //  title: "How to use security",
      //  desc: ""
      //}
    ];

  }

}());
