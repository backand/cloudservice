'use strict';

function DatabaseEditPage() {
  var self = this;

  self.hooks = {
    title: element(by.testHook('database-edit.title')),
    customJsonTab: element(by.testHook('database-edit.json.custom')),
    createButton: element(by.testHook('database-edit.create'))
  };

  self.actions = {
    createCustomDatabase: function () {
      self.hooks.customJsonTab.click();
      self.hooks.createButton.click();
      return browser.driver.wait(function() {
        return browser.driver.getCurrentUrl().then(function(url) {
          return /start/.test(url);
        });
      }, 10000);
    }
  }

}

module.exports = new DatabaseEditPage();
