"use strict";

var Q = require('q'),
    utils = require('../support/utils'),
    sync = utils.sync;

function sendKeyUp(targetSelector, keyCode) {
  var event = this.window.document.createEvent('HTMLEvents');
  event.initEvent('keyup', true, true);
  event.which = keyCode;
  event.keyCode = keyCode;
  var target = this.query(targetSelector);
  if (target)
    target.dispatchEvent(event);
  return this.wait();
}

function makeTaskList(browser) {
  function makeTaskUI(taskDOM) {
    return {
      toggleWithCheck: function () {
        var checkbox = browser.query('.chk', taskDOM);
        if (checkbox.checked)
          browser.uncheck(checkbox);
        else
          browser.check(checkbox);
        return browser.wait();
      },
      toggleWithoutCheck: function () {
        return browser.click(browser.query('.txt', taskDOM));
      },
      data: function () {
        return {
          inProgress: taskDOM.className.indexOf('working') !== -1,
          done: browser.query('.chk', taskDOM).checked,
          description: browser.query('.txt', taskDOM).innerHTML
        };
      }
    };
  }

  function tasksDom() {
    return browser.queryAll('.task-list > .task');
  }

  function tasks() {
    return tasksDom().map(makeTaskUI);
  }

  return {
    toDataArray: function () {
      return tasks().map(function (taskUI) {
        return taskUI.data();
      });
    },
    taskAt: function (index) {
      var taskList = tasks();
      if (index < 0)
        throw 'Error, there are no tasks. Expected task at index:' + index;
      if (index >= taskList.length)
        throw 'Error, there are only ' + taskList.length + ' tasks. Expected task at index:' + index;
      return taskList[index];
    },
    numberOfTasks: function () {
      return tasksDom().length;
    }
  };
}

module.exports = function (browser) {
  browser.sendKeyUp = sendKeyUp;

  return {
    visit: function (distro) {
      return browser.visit('/todo_with_' + distro + '.html');
    },
    enterTaskName: Q.nfbind(sync(function (taskName) {
      browser.fill('.add-task-widget > .txt', taskName);
    })),
    requestNewTaskUsingKeyboard: function () {
      return browser.sendKeyUp('.add-task-widget > .txt', 13);
    },
    requestNewTaskWithoutKeyboard: function () {
      return browser.click('.add-task-widget > .btn');
    },
    taskList: function () {
      return makeTaskList(browser);
    }
  };
};