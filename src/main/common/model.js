/*
 * An classic model layer for todo list application
 * The Store is dummy, and really backed in memory, but simulates asynch access to backend
 */
var todo = (function (ns, undefined) {
  ns = ns || {};
  ns.model = ns.model || {};

  ns.model.Tasks = function (store, optTaskFactory) {
    var makeTask = optTaskFactory || function (dto) {
      return new ns.model.Task(dto, store);
    };
    var allTasks = function (callback) {
      store.all(function (dtos) {
        callback(dtos.map(makeTask));
      });
    };

    this.newTask = function (description, callback) {
      var task = makeTask({
        description:description,
        done:false
      });
      task.save(function (task) {
        callback(task);
      });
      return task;
    };
    this.forEach = function (callback) {
      allTasks(function (tasks) {
        tasks.forEach(callback);
      });
    };
  };

  ns.model.Task = function (initialData, store) {
    var id = initialData.id;
    var description = initialData.description;
    var done = initialData.done;
    this.toDTO = function () {
      return {
        'description':description,
        'id':id,
        'done':done
      };
    };
    this.done = function (optIsDone) {
      if(typeof optIsDone === 'boolean' && optIsDone !== done)
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
  };

  return ns;
}(todo));