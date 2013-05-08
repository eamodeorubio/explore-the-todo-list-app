"use strict";

var utils = require('../support/utils'),
    sync = utils.sync,
    toIndex = utils.toIndex,
    chai = require('chai'),
    expect = chai.expect;

function thereAreAtLeast(n, world) {
  var self = world;
  return function () {
    return self.UI().taskList().numberOfTasks() >= n;
  };
}

function taskIsNotInProgress(index, world) {
  var self = world;
  return function () {
    return !self.UI().taskList().taskAt(index).data().inProgress;
  };
}

module.exports = function () {
  this.World = require('../support/world');

  this.Then("the user will see no tasks", sync(function () {
    expect(this.UI().taskList().toDataArray()).to.be.eql([]);
  }));

  this.Then("the user will see all the tasks", sync(function () {
    expect(this.UI().taskList().toDataArray()).to.be.eql(this.setUp().defaultTaskList().toDataArray());
  }));

  this.Then('the user will see that the task $n is "$status" after a while', function (n, status, done) {
    var self = this,
        index = toIndex(n);
    self
        .waitUntil(thereAreAtLeast(index + 1, self), 'must be at least ' + (index + 1) + ' tasks', 1000)
        .then(function () {
          return self.waitUntil(taskIsNotInProgress(index, self), 'task ' + index + ' is not in progress', 1000);
        })
        .then(function () {
          var taskUIList = self.UI().taskList();
          expect(taskUIList.taskAt(index).data().done ? 'done' : 'to do').to.be.equal(status);
        })
        .then(done, done);
  });
};