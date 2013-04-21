describe("An AppWidget, initialized with a view model and a widget factory", function () {
  var widget, factory, viewModel, createTaskWidget;
  beforeEach(function () {
    createTaskWidget = test.doubleFor('createTaskWidget');

    factory = test.spy('factory', ['newCreateTaskWidget', 'newTaskWidget']);
    factory.newCreateTaskWidget.andReturn(createTaskWidget);

    viewModel = test.doubleFor('appViewModel');

    widget = new todo.widget.AppWidget(viewModel, factory);
  });
  it("will ask the factory to create a CreateTaskWidget", function () {
    expect(factory.newCreateTaskWidget).toHaveBeenCalledWith(viewModel.newTaskDescription, viewModel.addTaskBtn);
  });
  it("has a newWidgetForTask method that ask the factory to create a new TaskWidget", function () {
    var taskDTO = test.spy('task dto');
    var taskWidget = test.spy('task widget');
    var taskViewModel = test.spy('task view model');
    viewModel.newViewForTask.andReturn(taskViewModel);
    factory.newTaskWidget.andReturn(taskWidget);

    var result = widget.newWidgetForTask(taskDTO);

    expect(viewModel.newViewForTask).toHaveBeenCalledWith(taskDTO);
    expect(result).toBe(taskWidget);
  });
  it("has an onNewTaskRequest that will register a callback into the 'NewTaskRequest' event of createTaskWidget", function () {
    var callback = jasmine.createSpy('callback');

    widget.onNewTaskRequest(callback);

    expect(createTaskWidget.onNewTaskRequest).toHaveBeenCalledWith(callback);
  });
  describe("has an attachToDOM method, that when called", function () {
    beforeEach(function () {
      widget.attachToDOM();
    });
    it("will call attachToDOM on the view model", function () {
      expect(viewModel.attachToDOM).toHaveBeenCalled();
    });
    it("will call put focus on the createTaskWidget", function () {
      expect(createTaskWidget.focus).toHaveBeenCalledWith(true);
    });
  });
});