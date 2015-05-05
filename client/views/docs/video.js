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
        img: "https://img.youtube.com/vi/1x9v1jGE3l8/mqdefault.jpg",
        href: "//www.youtube.com/watch?v=1x9v1jGE3l8",
        title: "Backand quick review",
        desc: "Backand quick review Backand quick review Backand quick review"
      },
      {
        img: "https://img.youtube.com/vi/8M9frWFlxh4/mqdefault.jpg",
        href: "//www.youtube.com/watch?v=8M9frWFlxh4",
        title: "Backand short tour",
        desc: "Backand short tour Backand short tour Backand short tour Backand short tour"
      },
      {
        img: "https://img.youtube.com/vi/IU_qp2yzU9Q/mqdefault.jpg",
        href: "//www.youtube.com/watch?v=IU_qp2yzU9Q",
        title: "Backand complete product review",
        desc: "Backand complete product review Backand complete product review Backand complete product review"
      },
      {
        img: "https://img.youtube.com/vi/mFYSe4VFHCI/mqdefault.jpg",
        href: "//www.youtube.com/watch?v=mFYSe4VFHCI",
        title: "How to sync a Database and Backand's ORM",
        desc: "How to sync a Database and Backand's ORM How to sync a Database and Backand's ORM How to sync a Database and Backand's ORM How to sync a Database and Backand's ORM How to sync a Database and Backand's ORM"
      },
      {
        img: "https://img.youtube.com/vi/7C6AHmK-zcM/mqdefault.jpg",
        href: "//www.youtube.com/watch?v=7C6AHmK-zcM",
        title: "How to build server side logic using Backand's Action",
        desc: "How to build server side logic using Backand's Action How to build server side logic using Backand's Action How to build server side logic using Backand's Action"
        },
      {
        img: "https://img.youtube.com/vi/mzxjDxozmLQ/mqdefault.jpg",
        href: "//www.youtube.com/watch?v=mzxjDxozmLQ",
        title: "How to build Backand's Query",
        desc: "How to build Backand's Query How to build Backand's Query How to build Backand's Query"
      },
      {
        img: "https://img.youtube.com/vi/KG3rL1xHEg4/mqdefault.jpg",
        href: "//www.youtube.com/watch?v=KG3rL1xHEg4",
        title: "How to customize Backand's security",
        desc: "How to customize Backand's security How to customize Backand's security How to customize Backand's security"
      }
    ];

  }

}());
