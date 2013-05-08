"use strict";

var makeUI = require('./ui'),
    makeSetUp = require('./setup'),
    Q = require('q'),
    Browser = require('zombie'),
    baseURL = 'http://localhost:8088';

module.exports = function (done) {
  try {
    var browser = new Browser({ site: baseURL}),
        ui = makeUI(browser),
        setup = makeSetUp(browser.localStorage('localhost:8088'));

    this.UI = function () {
      return ui;
    };

    this.setUp = function () {
      return setup;
    };

    this.waitUntil = function (condition, msg, timeout) {
      var deferred = Q.defer(),
          start = Date.now();

      function evalCondition() {
        try {
          if (condition())
            deferred.resolve();
          else if (timeout < (Date.now() - start))
            deferred.reject(new Error('Condition not met in ' + timeout + ' ms: ' + msg));
          else
            setTimeout(evalCondition, 0);
        } catch (err) {
          deferred.reject(err);
        }
      }

      evalCondition();

      return deferred.promise;
    };

    done();
  } catch (err) {
    done(err);
  }
};