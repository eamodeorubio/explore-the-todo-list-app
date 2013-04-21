/*
 * A simple controller layer for todo list application
 * Binds the "active record" models to the application level widgets
 */
"use strict";

function createAndBindWidgetForTask(task, taskListWidget) {
  var taskWidget = taskListWidget.newWidgetForTask(task.toDTO());
  taskWidget.onToggleDoneRequest(function (newDone) {
    task.done(newDone);
    task.save(function (task) {
      taskWidget.done(task.done());
    });
  });
  return taskWidget;
}

module.exports = {
  createAndBindWidgetForTask: createAndBindWidgetForTask,
  AppController: function (taskList, taskListWidget, taskWidgetFactory) {
    taskWidgetFactory = taskWidgetFactory || createAndBindWidgetForTask;

    // Public
    this.start = function (callback) {
      taskListWidget.onNewTaskRequest(function (description) {
        var task, taskWidget;
        task = taskList.newTask(description, function () {
          taskWidget.working(false);
        });
        taskWidget = taskWidgetFactory(task, taskListWidget);
        taskWidget.working(true);
      });
      taskListWidget.attachToDOM();
      taskList.forEach(function (task) {
        taskWidgetFactory(task, taskListWidget);
      }, callback);
    };
  }
};