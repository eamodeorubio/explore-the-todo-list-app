/*
 * Widgets are resusable low level controllers.
 * You can also think about widgets as application level views.
 * Their main responsability is convert low level UI concepts to application level concepts,
 * but they are decoupled from DOM and presentation details through a DOM acces layer or low level views.
 * Common functionality implemented in them are:
 * - Convert DOM events to application level events
 * - Formatting & Validation logic
 * - Map application level fields to low level fields in views
 * - Decouples the rest of the application from the specific presentation framework/technology
 * - Act as low level controller, coordinating user gestures with the DOM views.
 */
/*
 * In the case of the todo list application we have three widgets
 * - A "AppWidget" that represents the full todo list UI. It is a container of:
 *    a) A "CreateTaskWidget"
 *    c) A list of "TaskWidget"s
 * - A "CreateTaskWidget" that allows the user to create new tasks. Its functionality is:
 *    a) Allows the user to create new tasks
 *    b) Emit a "NewTaskRequest" event whenever the user requests the creation of a new task
 *    c) Control the enable/disable logic of the DOM
 * - A "TaskWidget" that represents a concrete task to the user. Its responsabilities are:
 *    a) Show the information of a task to the user
 *    b) Allow the user to mark a task a 'done' or 'todo'
 *    c) Emit a "ToggleDoneRequest" event whenever the user requests changing the task to 'done' or 'todo'
 *    d) Control the enable/disable logic of the DOM
 *    e) Give feedback to the user about the progress of the operations (create a task and toggle it are asynchronous and not instantaneous)
 */
var todo = (function (ns, undefined) {
  ns = ns || {};
  ns.widget = ns.widget || {};

  ns.widget.TaskWidget = function (ui, optToggleDoneRequestEvent) {
    // PRIVATE
    var toggleDoneRequest = optToggleDoneRequestEvent || new ns.utils.Event();
    var fireToggleRequest = function () {
      if(ui.working())
        return;
      var done = !ui.done();
      ui.doneChk.checked(done);
      ui.working(true);
      toggleDoneRequest.publish(done);
    };
    var doneChanged = function () {
      ui.working(false);
    };
    var workingChanged = function (isWorking) {
      ui.doneChk.enabled(!isWorking);
    };
    // PUBLIC
    this.done = ui.done.bind(ui);
    this.working = ui.working.bind(ui);
    this.onToggleDoneRequest = toggleDoneRequest.subscribe.bind(toggleDoneRequest);

    // INIT & BIND
    ui.done.subscribe(doneChanged);
    ui.working.subscribe(workingChanged);
    ui.doneChk.checked.subscribe(fireToggleRequest);
    ui.onDescriptionClicked(fireToggleRequest);
  };

  ns.widget.CreateTaskWidget = function (newTaskDescription, addTaskBtn, optNewTaskRequestEvent) {
    // PRIVATE
    var newTaskRequest = optNewTaskRequestEvent || new ns.utils.Event();
    var updateButtonEnabled = function (newText) {
      addTaskBtn.enabled(!!newText);
    };
    var fireNewTaskRequest = function () {
      var taskDescription = newTaskDescription.text();
      if(!taskDescription)
        return;
      newTaskDescription.text('');
      newTaskRequest.publish(taskDescription);
    };

    // PUBLIC
    this.onNewTaskRequest = newTaskRequest.subscribe.bind(newTaskRequest);
    this.focus = newTaskDescription.focus.bind(newTaskDescription);

    // INIT & BIND
    newTaskDescription.onKeyUp(function (event) {
      if(event.keyCode === 13)
        fireNewTaskRequest();
    });
    newTaskDescription.text.subscribe(updateButtonEnabled);
    addTaskBtn.onClick(fireNewTaskRequest);
    updateButtonEnabled(newTaskDescription.text());
  };

  ns.widget.factory = {
    newCreateTaskWidget:function (txtField, btn) {
      return new ns.widget.CreateTaskWidget(txtField, btn);
    },
    newTaskWidget:function (taskViewModel) {
      return new ns.widget.TaskWidget(taskViewModel);
    }
  };

  ns.widget.AppWidget = function (ui, optFactory) {
    // PRIVATE
    var factory = optFactory || ns.widget.factory;
    var createTaskWidget = factory.newCreateTaskWidget(ui.newTaskDescription, ui.addTaskBtn);

    // PUBLIC
    this.newWidgetForTask = function (dto) {
      return factory.newTaskWidget(ui.newViewForTask(dto));
    };
    this.onNewTaskRequest = createTaskWidget.onNewTaskRequest.bind(createTaskWidget);
    this.attachToDOM = function () {
      ui.attachToDOM();
      createTaskWidget.focus(true);
    };
  };
  return ns;
}(todo));