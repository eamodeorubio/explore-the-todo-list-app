describe("The AppController, initialized with a task list model, a widget, a newTask and a taskWidgetFactory", function () {
  var controller, taskListModel, taskListWidget, taskWidgetFactory;
  beforeEach(function () {
    taskWidgetFactory = jasmine.createSpy("taskWidgetFactory");
    taskListModel = test.doubleFor('tasks', 'taskListModel');
    taskListWidget = test.doubleFor('appWidget', 'taskListWidget');
    controller = new todo.controller.AppController(taskListModel, taskListWidget, taskWidgetFactory);
  });

  describe("has a start method, that when called", function () {
    beforeEach(function () {
      controller.start();
    });

    it("will call forEach of the task list model", function () {
      expect(taskListModel.forEach).toHaveBeenCalled();
    });

    describe("will call forEach of the task list model, with a callback that when called with a task", function () {
      var task;
      beforeEach(function () {
        task = test.doubleFor('task');
        taskListModel.callbackForLastForEachCall()(task);
      });

      it("will ask taskWidgetFactory to create a new widget for the task", function () {
        expect(taskWidgetFactory).toHaveBeenCalledWith(task, taskListWidget);
      });
    });

    describe("it will register on the event 'NewTaskRequest' of the widget", function () {
      it("a callback", function () {
        expect(taskListWidget.onNewTaskRequest).toHaveBeenCalled();
        expect(typeof taskListWidget.callbackForLastOnNewTaskRequestCall()).toBe('function');
      });
      describe("that when invoked with the requested task's description", function () {
        var description, taskWidget, task;
        beforeEach(function () {
          description = "requested task description";

          taskWidget = test.doubleFor('taskWidget');
          taskWidgetFactory.andReturn(taskWidget);

          task = test.doubleFor('task');
          taskListModel.newTask.andReturn(task);

          taskListWidget.callbackForLastOnNewTaskRequestCall()(description);
        });
        describe("will ask the model to create a new task", function () {
          it("with the description requested and a callback", function () {
            expect(taskListModel.newTask).toHaveBeenCalled();
            expect(taskListModel.descriptionForLastNewTaskCall()).toBe(description);
            expect(typeof taskListModel.callbackForLastNewTaskCall()).toBe('function');
          });
          it("will ask taskWidgetFactory to create a new widget for the new task", function () {
            expect(taskWidgetFactory).toHaveBeenCalledWith(task, taskListWidget);
          });
          it("will update the working state of the new task widget to true", function () {
            expect(taskWidget.working).toHaveBeenCalledWith(true);
          });
          it("when the new task creation finished, the callback will update the task widget working state to false", function () {
            taskListModel.callbackForLastNewTaskCall()();

            expect(taskWidget.working).toHaveBeenCalledWith(false);
          });
        });
      });
    });
    it("will call attachToDOM on the widget", function () {
      expect(taskListWidget.attachToDOM).toHaveBeenCalled();
    });
  });
});