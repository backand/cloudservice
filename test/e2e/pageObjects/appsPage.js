'use strict';

function AppsPage() {
  var self = this;
  self._init = function() {
    self._initNewApp();
  };

  self.hooks = {
    nameInput: element(by.testHook('apps.new-app.name')),
    titleInput: element(by.testHook('apps.new-app.title')),
    createButton: element(by.testHook('apps.new-app.create')),
    errorLabel: element(by.testHook('apps.new-app.error')),

    appPanels: element.all(by.testHook('apps.app-panel')),
    appPanelsRibbon: element(by.testHook('apps.app-panel.ribbon')),

    getFirstPanelRibbon: function () {
      return self.hooks.appPanels.first().element(by.testHook('apps.app-panel.ribbon'));
    },
    getFirstPanelLink: function () {
      return self.hooks.appPanels.first().element(by.testHook('apps.app-panel.link'));
    },
    getFirstPanelManageButton: function () {
      return self.hooks.appPanels.first().element(by.testHook('apps.app-panel.manage-button'));
    }
  };

  self.actions = {
    clickFirstPanelManageButton: function () {
      return self.hooks.getFirstPanelManageButton().click();
    }
  };

  self._initNewApp = function() {
    self.newApp = {
      fillIn: function(app) {
        if (app.name) helpers.fillInput(self.hooks.nameInput, app.name);
        if (app.title) helpers.fillInput(self.hooks.titleInput, app.title);
      },
      create: function(app) {
        this.fillIn(app);
        self.hooks.createButton.click();
      }
    };
  };

  self._init();
}

module.exports = new AppsPage();
