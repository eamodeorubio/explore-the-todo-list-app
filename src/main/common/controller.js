/*
 * A simple controller layer for todo list application
 * Binds the "active record" models to the application level widgets
 */
var todo = (function (ns, undefined) {
  ns = ns || {};
  ns.controller = ns.controller || {};

  ns.controller.createAndBindWidgetForTask = function (task, taskListWidget) {
    var taskWidget = taskListWidget.newWidgetForTask(task.toDTO());
    taskWidget.onToggleDoneRequest(function (newDone) {
      task.done(newDone);
      task.save(function (task) {
        taskWidget.done(task.done());
      });
    });
    return taskWidget;
  };

  ns.controller.AppController = function (taskList, taskListWidget, taskWidgetFactory) {
    taskWidgetFactory = taskWidgetFactory || ns.controller.createAndBindWidgetForTask;

    // Public
    this.start = function (callback) {
      taskList.forEach(function (task, isLast) {
        taskWidgetFactory(task, taskListWidget);
        if (isLast && typeof callback === 'function')
          callback();
      });
      taskListWidget.onNewTaskRequest(function (description) {
        var task, taskWidget;
        task = taskList.newTask(description, function () {
          taskWidget.working(false);
        });
        taskWidget = taskWidgetFactory(task, taskListWidget);
        taskWidget.working(true);
      });
      taskListWidget.attachToDOM();
    };
  };
  return ns;
}(todo));