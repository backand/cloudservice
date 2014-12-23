(function  () {
    'use strict';

    angular.module('app.playground')
        .controller('Playground',["$scope",'SessionService','$state','usSpinnerService',Playground]);

    function Playground($scope,SessionService,$state,usSpinnerService){
        var self = this;
        var token = SessionService.getToken();
        var appName = $state.params.name;

        window.addEventListener('message', function (e) {
            var eventName = e.data[0];
            var data = e.data[1];
            switch (eventName) {
                case 'setHeight':
                    $("#restIfrmae").height(data + 50);
                    break;
                case 'ready':
                    var o = document.getElementsByTagName('iframe')[0];
                    usSpinnerService.spin("loading");

                    var message = { auth: 'bearer ' + token, appName: appName };
                    //var auth = SessionService.getAuthHeader();
                    o.contentWindow.postMessage(message, "*");
                    break;
                case 'complete':
                    usSpinnerService.stop("loading");
                    break;
            }
        }, false);
    }




}());
