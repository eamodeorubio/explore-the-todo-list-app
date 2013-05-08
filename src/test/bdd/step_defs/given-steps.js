"use strict";

var enterTheApp = require('../support/utils').enterTheApp;

module.exports = function () {
  this.World = require('../support/world');

  this.Given("there are no tasks yet", function (done) {
    this.setUp().emptyTaskList().save().then(done, done);
  });

  this.Given("there are some tasks", function (done) {
    this.setUp().defaultTaskList().save().then(done, done);
  });

  this.Given("the user has visited the $distro application", enterTheApp);

  this.Given("the user has specified the new task description as '$taskName'", function (taskName, done) {
    this.UI().enterTaskName(taskName).then(done, done);
  });

  this.Given("there are some tasks with the following statuses:", function (statusTable, done) {
    var doneList = statusTable.hashes().map(function (row) {
      return row.status === 'done';
    });

    this.setUp()
        .defaultTaskList()
        .setDone(doneList)
        .save()
        .then(done, done);
  });

  this.Given("the user has specified the new task description as '$taskName'", function (taskName, done) {
    this.UI().enterTaskName(taskName).then(done, done);
  });
};