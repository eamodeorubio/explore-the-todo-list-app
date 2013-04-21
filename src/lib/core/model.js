/*
 * An classic model layer for todo list application
 * The Store is dummy, and really backed in memory, but simulates asynch access to backend
 */
"use strict";

function Task(initialData, store) {
  var id = initialData.id;
  var description = initialData.description;
  var done = initialData.done;
  this.toDTO = function () {
    return {
      'description': description,
      'id': id,
      'done': done
    };
  };
  this.done = function (optIsDone) {
    if (typeof optIsDone === 'boolean' && optIsDone !== done)
      done = !done;
    return done;
  };
  this.save = function (callback) {
    var self = this;
    store.save(self.toDTO(), function (dto) {
      id = dto.id;
      callback(self);
    });
  };
}

module.exports = {
  Tasks: function (store, optTaskFactory) {
    var makeTask = optTaskFactory || function (dto) {
      return new Task(dto, store);
    };
    var allTasks = function (callback) {
      store.all(function (dtos) {
        callback(dtos.map(makeTask));
      });
    };

    this.newTask = function (description, callback) {
      var task = makeTask({
        description: description,
        done: false
      });
      task.save(function (task) {
        callback(task);
      });
      return task;
    };
    this.forEach = function (callback, optEndCallback) {
      allTasks(function (tasks) {
        var numberOfTasks = tasks.length;
        for (var i = 0; i < numberOfTasks; i++)
          callback(tasks[i]);
        if (typeof optEndCallback === 'function')
          optEndCallback();
      });
    };
  },
  Task: Task
};



