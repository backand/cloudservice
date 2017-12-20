'use strict';

function Helpers() {
  var self = this;
  browser.getCapabilities().then(function (capabilities) {
    self.browserName = capabilities.get('browserName');
  });
}

var TIMEOUT = 1000;
var DEFAULT_WIDTH = 1280;
var DEFAULT_HEIGHT = 1024;

// Promise helpers
Helpers.prototype.not = function (promise) {
  return promise.then(function (result) {
    return !result;
  });
};

// Page helpers
Helpers.prototype.safeGet = function (url) {
  browser.get(url);
  this.maximizeWindow();
  this.resetPosition();
};

Helpers.prototype.maximizeWindow = function (width, height) {
  width = width || DEFAULT_WIDTH;
  height = height || DEFAULT_HEIGHT;
  browser.driver.manage().window().setSize(width, height);
};

Helpers.prototype.resetPosition = function () {
  $$('[test-hook=start-point]').each(function (startPoint) {
    browser.actions().mouseMove(startPoint).perform();
  });
};

Helpers.prototype.displayHover = function (element) {
  browser.actions().mouseMove(element).perform();
  browser.wait(function () {
    return element.isDisplayed();
  });
};

// Calling isDisplayed when element is not present causes an exception
Helpers.prototype.waitForElement = function (element, timeout) {
  browser.wait(function () {
    return element.isPresent().then(function (isPresent) {
      return isPresent && element.isDisplayed();
    });
  }, timeout || TIMEOUT);
};

// Calling isDisplayed when element is not present causes an exception
Helpers.prototype.waitForElementToDisappear = function (element, timeout) {
  var self = this;
  browser.wait(function () {
    return element.isPresent().then(function (isPresent) {
      if (isPresent) {
        return self.not(element.isDisplayed());
      }
      else {
        return true;
      }
    });
  }, timeout || TIMEOUT);
};

Helpers.prototype.selectOptionByText = function (select, text) {
  var optionElement = select.element(by.cssContainingText('option', text));
  this.selectOption(optionElement);
};

// zero-based index
Helpers.prototype.selectOptionByIndex = function (select, index) {
  var optionElement = select.all(by.css('option')).get(index);
  this.selectOption(optionElement);
};

Helpers.prototype.selectOption = function (optionElement) {
  if (this.isFirefox()) {
    browser.actions().mouseMove(optionElement).mouseDown().mouseUp().perform();
  }
  else {
    optionElement.click();
  }
};

Helpers.prototype.fillInput = function (input, text) {
  input.clear();
  input.sendKeys(text);
};

Helpers.prototype.isFirefox = function () {
  return this.browserName === 'firefox';
};

Helpers.prototype.createMessage = function (context, message) {
  context.message = function () {
    var msg = message
      .replace('{{actual}}', context.actual)
      .replace('{{not}}', (context.isNot ? ' not ' : ' '));

    if (context.actual.locator) {
      msg = msg.replace('{{locator}}', context.actual.locator());
    }
    return msg;
  };
};

Helpers.prototype.logout = function () {
  browser.get(browser.baseUrl + '/#/logout');
}

module.exports = new Helpers();

'use strict';

(function () {
  by.addLocator('testHook', function (hook, optParentElement, optRootSelector) {
    var using = document;
    return using.querySelector('[test-hook=\'' + hook + '\']');
  });

  by.addLocator('testHookAll', function (hook, optParentElement, optRootSelector) {
    var using = document;
    return using.querySelectorAll('[test-hook=\'' + hook + '\']');
  });
})();
'use strict';

(function () {
  var helpers = new Helpers();

  beforeEach(function () {
    jasmine.addMatchers({
      toBePresent: function () {
        return {
          compare: function (actual, expected) {
            var _this = {};
            _this.pass = actual.isPresent();
            _this.message = 'Expected element' + (_this.pass ? '' : ' not') + ' to Be Present ';
            return _this;
          }
        }
      },
      toBeDisplayed: function () {
        return {
          compare: function (actual, expected) {
            if (expected === undefined) {
              expected = '';
            }
            var _this = {};
            _this.pass = actual.isDisplayed();
            _this.message = 'Expected element' + (_this.pass ? '' : ' not') + ' to Be Displayed ' + expected;
            return _this;
          }
        }
      },
      toHaveLengthOf: function (actual, expected) {
        var _this = {};
        _this.pass = actual === expected;
        _this.message = 'Expected ' + actual + (_this.pass ? '' : ' not') + ' to have length of ' + expected;
        return _this;
      },
      toHaveText: function () {
        return {
          compare: function (actual, expected) {
            var _this = {};
            _this.pass = actual.getText() === expected;
            _this.message = 'Expected ' + actual.getText() + ' ' + (_this.pass ? '' : ' not') + ' to have text ' + expected;
            return _this;
          }
        }

      },
      toMatchRegex: function (actual, expected) {
        var _this = {};
        var re = new RegExp(expected);
        return this.actual.getText().then(function (text) {
          _this.pass = re.test(text);
          _this.message = 'Expected ' + actual + (_this.pass ? '' : ' not') + ' to match pattern ' + expected;
          return _this;
        });
      },
      toMatchMoney: function (expectedValue, currencySymbol) {
        var _this = {};
        var regexExpectedValue = createMoneyRegexp(this.actual, expectedValue, currencySymbol, false);
        helpers.createMessage(_this, 'Expected ' + this.actual + '{{not}}to match money pattern ' + regexExpectedValue);
        return

        _this.pass = regexExpectedValue.test(this.actual);
        _this.message = 'Expected ' + actual + (_this.pass ? '' : ' not') + ' to match pattern ' + expected;
        return _this;

      },
      toMatchMoneyWithFraction: function (expectedValue, currencySymbol) {
        var _this = {};
        var regexExpectedValue = createMoneyRegexp(this.actual, expectedValue, currencySymbol, true);
        helpers.createMessage(_this, 'Expected ' + this.actual + '{{not}}to match money pattern ' + regexExpectedValue);
        return regexExpectedValue.test(this.actual);
      },
      toHaveValue: function (expectedValue) {
        var _this = {};
        return this.actual.getAttribute('value').then(function (value) {
          helpers.createMessage(_this, 'Expected {{locator}}{{not}} to have value ' + expectedValue + ' but was ' + value);
          return value === expectedValue;
        });
      },
      toHaveClass: function (className) {
        var _this = {};
        return this.actual.getAttribute('class').then(function (classes) {
          helpers.createMessage(_this, 'Expected ' + classes + '{{not}}to have class ' + className);

          return classes.split(' ').indexOf(className) !== -1;
        });
      },
      toBeChecked: function () {
        helpers.createMessage(this, 'Expected {{locator}}{{not}} to be checked');
        return this.actual.getAttribute('checked').then(function (value) {
          return value;
        });
      },
      toHaveFocus: function () {
        var _this = {};
        var activeElement = browser.driver.switchTo().activeElement();
        return this.actual.getOuterHtml().then(function (html1) {
          return activeElement.getOuterHtml().then(function (html2) {
            helpers.createMessage(_this, 'Expected ' + html1.substring(0, 40) + '{{not}} to have focus, but focus is on ' + html2.substring(0, 40) + '...');
            return html1 === html2;
          });
        });
      }
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //  Money Matcher Functions
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * Gets a number and adds commas in the right place
   * @param number
   * @returns {string}
   */
  var getNumberWithCommas = function (number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  /**
   * Creates a regular expression to match money representation with or without spaces in between
   * @param matchedValue - the number that is tested
   * @param expectedValue - the number to match against
   * @param currencySymbol {string}
   * @param isFraction {boolean} - flag to add the necessary postfix to expectedValue
   * @returns {RegExp}
   */
  var createMoneyRegexp = function (matchedValue, expectedValue, currencySymbol, isFraction) {
    var minusSign = '';
    if (matchedValue.indexOf('-') !== -1) {
      minusSign = '-';
    }

    expectedValue = getNumberWithCommas(expectedValue);
    if (isFraction && expectedValue.indexOf('.') === -1) {
      expectedValue += '.00';
    }
    return new RegExp('^' + minusSign + '\\s*' + '\\' + currencySymbol + '\\s*' + expectedValue + '$');
  };
})();
