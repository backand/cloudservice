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
        img: "https://img.youtube.com/vi/-35LHkNiorc/mqdefault.jpg",
        href: "https://www.youtube.com/embed/-35LHkNiorc?rel=0&autoplay=1",
        title: "2 minutes overview",
        desc: ""
      },
      {
        img: "https://img.youtube.com/vi/IU_qp2yzU9Q/mqdefault.jpg",
        href: "https://www.youtube.com/embed/IU_qp2yzU9Q?rel=0&autoplay=1",
        title: "15 min product tour",
        desc: ""
      },
      {
        img: "https://img.youtube.com/vi/mFYSe4VFHCI/mqdefault.jpg",
        href: "https://www.youtube.com/embed/mFYSe4VFHCI?rel=0&autoplay=1",
        title: "Working with Database and schema model",
        desc: ""
      },
      {
        img: "https://img.youtube.com/vi/7C6AHmK-zcM/mqdefault.jpg",
        href: "https://www.youtube.com/embed/7C6AHmK-zcM?rel=0&autoplay=1",
        title: "How to build server side logic using Backand's Actions",
        desc: ""
        },
      {
        img: "https://img.youtube.com/vi/mzxjDxozmLQ/mqdefault.jpg",
        href: "https://www.youtube.com/embed/mzxjDxozmLQ?rel=0&autoplay=1",
        title: "How to build a Query",
        desc: ""
      },
      {
        img: "https://img.youtube.com/vi/KG3rL1xHEg4/mqdefault.jpg",
        href: "https://www.youtube.com/embed/KG3rL1xHEg4?rel=0&autoplay=1",
        title: "How to use security",
        desc: ""
      }
    ];

  }

}());
