"use strict";

var Q = require('q'),
    utils = require('../support/utils'),
    sync = utils.sync;

function copyTasks(tasks) {
  return tasks.map(function (task) {
    return {
      id: task.id,
      inProgress: task.inProgress,
      done: task.done,
      description: task.description
    };
  });
}

function makeTaskList(localStorage, initialData) {
  var data = copyTasks(initialData);

  return {
    toDataArray: function () {
      return copyTasks(data).map(function (task) {
        // Id is invisible !
        delete task.id;
        return task;
      });
    },
    setDone: function (doneList) {
      doneList.forEach(function (done, i) {
        if (data[i])
          data[i].done = done;
      });
      return this;
    },
    save: Q.nfbind(sync(function () {
      localStorage.setItem('todo.store', JSON.stringify(data.map(function (task) {
        return JSON.stringify(task);
      })));
    }))
  };
}

module.exports = function (localStorage) {
  return {
    emptyTaskList: function () {
      return makeTaskList(localStorage, []);
    },
    defaultTaskList: function () {
      return makeTaskList(localStorage, [
        {description: 'task 1', done: false, inProgress: false, id: 'id1'},
        {description: 'task 2', done: true, inProgress: false, id: 'id2'},
        {description: 'task 3', done: false, inProgress: false, id: 'id3'}
      ]);
    }
  };
};