'use strict';

function ExampleDatabasePage() {
  var self = this;

  self.hooks = {
    title: element(by.testHook('example.database.title')),
    connectButton: element(by.testHook('example.database.connect'))
  };

  self.actions = {
    connectToDatabase: function () {
      self.hooks.connectButton.click();
      return browser.driver.wait(function() {
        return browser.driver.getCurrentUrl().then(function(url) {
          return /playground/.test(url);
        });
      }, 10000);
    }
  }

}

module.exports = new ExampleDatabasePage();
