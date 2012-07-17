// Keep 'storage' public for integrated testing setup
var storage = new todo.store.InMemoryStorage();
$(function () {
  var domView = new todo.view.$.AppViewModel({
    'tasksList':$('.task-list-widget .task-list .task'),
    'newTaskDescription':$('.add-task-widget .txt'),
    'addTaskBtn':$('.add-task-widget .btn')
  });
  var model = new todo.model.Tasks(storage);
  var widget = new todo.widget.AppWidget(domView);
  var app = new todo.controller.AppController(model, widget);
  app.start();
});

