describe("The function createAndBindWidgetForTask, when invoked with a task and a task list widget", function () {
  var task, taskListWidget, taskDTO, result, taskWidget;
  beforeEach(function () {
    taskDTO = test.spy('task dto');

    task = test.doubleFor('task');
    task.toDTO.andReturn(taskDTO);

    taskWidget = test.doubleFor('taskWidget');
    taskListWidget = test.doubleFor('appWidget');
    taskListWidget.newWidgetForTask.andReturn(taskWidget);

    result = todo.controller.createAndBindWidgetForTask(task, taskListWidget);
  });
  it("will ask the app widget to create a new widget for the task", function () {
    expect(taskListWidget.newWidgetForTask).toHaveBeenCalledWith(taskDTO);
  });
  it("will return the new task widget returned by the app widget", function () {
    expect(result).toBe(taskWidget);
  });
  describe("will register on the event 'ToggleDoneRequest' of the new task widget", function () {
    it("a callback", function () {
      expect(taskWidget.onToggleDoneRequest).toHaveBeenCalled();
      expect(typeof taskWidget.callbackForLastOnToggleDoneRequestCall()).toBe('function');
    });
    describe("that when invoked with the new done state requested by the user", function () {
      var newDoneRequested;
      beforeEach(function () {
        newDoneRequested = true;
        taskWidget.callbackForLastOnToggleDoneRequestCall()(newDoneRequested);
      });
      it("will modify the task done state with the new done state requested", function () {
        expect(task.done).toHaveBeenCalledWith(newDoneRequested);
      });
      describe("and will save the task", function () {
        it("registering a callback", function () {
          expect(task.save).toHaveBeenCalled();
          expect(typeof task.callbackForLastSaveCall()).toBe('function');
        });
        it("that when invoked, will update the taskWidget done status", function () {
          task.done.andReturn(newDoneRequested);

          task.callbackForLastSaveCall()(task);

          expect(taskWidget.done).toHaveBeenCalledWith(newDoneRequested);
        });
      });
    });
  });
});