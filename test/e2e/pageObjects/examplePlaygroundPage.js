'use strict';

function examplePlaygroundPage() {
  var self = this;

  self.hooks = {
    title: element(by.testHook('example.playground.title')),
    iframeSubstitute: element(by.testHook('example.playground.iframe-substitute'))
  };


}

module.exports = new examplePlaygroundPage();
