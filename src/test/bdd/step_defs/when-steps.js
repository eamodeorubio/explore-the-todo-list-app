"use strict";

var utils = require('../support/utils'),
    enterTheApp = utils.enterTheApp,
    toIndex = utils.toIndex;

module.exports = function () {
  this.World = require('../support/world');

  this.When("the user enters into the $distro application", enterTheApp);

  this.When("the user request the task to be added using the keyboard", function (done) {
    this.UI().requestNewTaskUsingKeyboard().then(done, done);
  });

  this.When("the user request the task to be added without the keyboard", function (done) {
    this.UI().requestNewTaskWithoutKeyboard().then(done, done);
  });

  this.When('the user toggles the task number $n "$gesture"', function (n, gesture, done) {
    var taskUI = this.UI().taskList().taskAt(toIndex(n)),
        promise;

    if (!taskUI)
      return done();

    if (gesture === 'toggling the check')
      promise = taskUI.toggleWithCheck();
    else
      promise = taskUI.toggleWithoutCheck();

    promise.then(done, done);
  });
};