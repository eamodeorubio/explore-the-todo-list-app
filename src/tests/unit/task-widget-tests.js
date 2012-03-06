describe("A TaskWidget, initialized with a task view model and a 'ToggleDoneRequest' event", function () {
  var widget, taskViewModel, toggleDoneRequestEvent;
  beforeEach(function () {
    taskViewModel = test.doubleFor('taskViewModel');
    toggleDoneRequestEvent = test.doubleFor('event');

    widget = new todo.widget.TaskWidget(taskViewModel, toggleDoneRequestEvent);
  });

  it("has a onToggleDoneRequest method that register a callback into 'ToggleDoneRequest' event", function () {
    var callback = jasmine.createSpy('callback');

    widget.onToggleDoneRequest(callback);

    expect(toggleDoneRequestEvent.subscribe).toHaveBeenCalledWith(callback);
  });
  it("has a working method that is equivalent to calling working on the task view model", function () {
    var newWorkingValue = true;
    var expectedResult = "expected working result";
    taskViewModel.working.andReturn(expectedResult);

    var result = widget.working(newWorkingValue);

    expect(taskViewModel.working).toHaveBeenCalledWith(newWorkingValue);
    expect(result).toBe(expectedResult);
  });
  it("has a done method that is equivalent to calling done on the task view model", function () {
    var newDoneValue = true;
    var expectedResult = "expected done result";
    taskViewModel.done.andReturn(expectedResult);

    var result = widget.done(newDoneValue);

    expect(taskViewModel.done).toHaveBeenCalledWith(newDoneValue);
    expect(result).toBe(expectedResult);
  });
  describe("will register a callback on the task view model working change event", function () {
    it("the callback is a valid function", function () {
      expect(taskViewModel.working.subscribe).toHaveBeenCalled();

      expect(typeof taskViewModel.working.callbackForLastSubscribeCall()).toBe('function');
    });
    it("when working changes to true, it will disable the checkbox of the task view model", function () {
      taskViewModel.working.callbackForLastSubscribeCall()(true);

      expect(taskViewModel.doneChk.enabled).toHaveBeenCalledWith(false);
    });
    it("when working changes to false, it will enable the checkbox of the task view model", function () {
      taskViewModel.working.callbackForLastSubscribeCall()(false);

      expect(taskViewModel.doneChk.enabled).toHaveBeenCalledWith(true);
    });
  });
  describe("will register a callback on the task view model done change event", function () {
    it("the callback is a valid function", function () {
      expect(taskViewModel.done.subscribe).toHaveBeenCalled();

      expect(typeof taskViewModel.done.callbackForLastSubscribeCall()).toBe('function');
    });
    it("when done changes to any value, it will stop working", function () {
      var anyValue = true;

      taskViewModel.done.callbackForLastSubscribeCall()(anyValue);

      expect(taskViewModel.working).toHaveBeenCalledWith(false);
    });
  });
  describe("will register a callback on the click event of the task description and the check change of the task checkbox", function () {
    it("the callback for the checkbox is a valid function", function () {
      expect(taskViewModel.doneChk.checked.subscribe).toHaveBeenCalled();

      expect(typeof taskViewModel.doneChk.checked.callbackForLastSubscribeCall()).toBe('function');
    });
    it("the callback for the task description's click event is a valid function", function () {
      expect(taskViewModel.onDescriptionClicked).toHaveBeenCalled();

      expect(typeof taskViewModel.callbackForLastOnDescriptionClickedCall()).toBe('function');
    });
    it("both callbacks are the same", function () {
      expect(taskViewModel.callbackForLastOnDescriptionClickedCall())
          .toBe(taskViewModel.doneChk.checked.callbackForLastSubscribeCall());
    });
    describe("when the user click on the task description or changes its checkbox", function () {
      it("won't do anything if the task widget is working", function () {
        taskViewModel.working.andReturn(true);

        taskViewModel.callbackForLastOnDescriptionClickedCall()();

        expect(toggleDoneRequestEvent.publish).not.toHaveBeenCalled();
      });
      describe("if the task widget is not working", function () {
        var newDesiredDoneState;
        beforeEach(function () {
          newDesiredDoneState = true;
          taskViewModel.done.andReturn(!newDesiredDoneState);
          taskViewModel.working.andReturn(false);

          taskViewModel.callbackForLastOnDescriptionClickedCall()();
        });
        it("will update the checkbox with the desired done state", function () {
          expect(taskViewModel.doneChk.checked).toHaveBeenCalledWith(newDesiredDoneState);
        });
        it("will show the user her request is being processed (working=true)", function () {
          expect(taskViewModel.working).toHaveBeenCalledWith(true);
        });
        it("will publish a 'ToggleDoneRequest' event with the desired done state", function () {
          expect(toggleDoneRequestEvent.publish).toHaveBeenCalledWith(newDesiredDoneState);
        });
      });
    });
  });
});