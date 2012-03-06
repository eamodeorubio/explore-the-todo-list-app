describe("A CreateTaskWidget, initialized with a task description text field, an add task button and a 'NewTaskRequest' event", function () {
  var widget, descriptionTxtField, addBtn, newTaskRequestEvent;
  beforeEach(function () {
    descriptionTxtField = test.doubleFor('textFieldViewModel');
    descriptionTxtField.text.andReturn('');
    addBtn = test.doubleFor('buttonViewModel');
    newTaskRequestEvent = test.doubleFor('event');

    widget = new todo.widget.CreateTaskWidget(descriptionTxtField, addBtn, newTaskRequestEvent);
  });

  var testWillClearTheTextFieldAndPublishNewTaskRequestEvent = function (callback) {
    it("if the task description text is empty, nothing will happen", function () {
      descriptionTxtField.text.andReturn('');

      callback();

      expect(newTaskRequestEvent.publish).not.toHaveBeenCalled();
    });
    describe("if the task description is not empty", function () {
      var newTaskDescriptionText;
      beforeEach(function () {
        newTaskDescriptionText = "new task to do";
        descriptionTxtField.text.andReturn(newTaskDescriptionText);

        callback();
      })
      it("the task description text will be cleared", function () {
        expect(descriptionTxtField.text).toHaveBeenCalledWith('');
      });
      it("a 'NewTaskRequest' event will be published", function () {
        expect(newTaskRequestEvent.publish).toHaveBeenCalledWith(newTaskDescriptionText);
      });
    });
  };

  it("has a onNewTaskRequest method that register a callback into 'NewTaskRequest' event", function () {
    var callback = jasmine.createSpy('callback');

    widget.onNewTaskRequest(callback);

    expect(newTaskRequestEvent.subscribe).toHaveBeenCalledWith(callback);
  });
  it("has a focus method that is equivalent to calling focus on the task description field", function () {
    var newFocusValue = true;
    var expectedResult = "expected focus result";
    descriptionTxtField.focus.andReturn(expectedResult);

    var result = widget.focus(newFocusValue);

    expect(descriptionTxtField.focus).toHaveBeenCalledWith(newFocusValue);
    expect(result).toBe(expectedResult);
  });
  it("will enable the add task btn if the description text field is not empty", function () {
    expect(addBtn.enabled).toHaveBeenCalledWith(!!descriptionTxtField.text());
  });
  describe("will register a callback on the description text field's text change event", function () {
    it("the callback is a valid function", function () {
      expect(descriptionTxtField.text.subscribe).toHaveBeenCalled();

      expect(typeof descriptionTxtField.text.callbackForLastSubscribeCall()).toBe('function');
    });
    it("when the text changes to an empty string, it will disable the add task button", function () {
      descriptionTxtField.text.callbackForLastSubscribeCall()('');

      expect(addBtn.enabled).toHaveBeenCalledWith(false);
    });
    it("when the text changes to an empty string, it will disable the add task button", function () {
      descriptionTxtField.text.callbackForLastSubscribeCall()('not empty');

      expect(addBtn.enabled).toHaveBeenCalledWith(true);
    });
  });
  describe("will register a callback on the click event of add task button", function () {
    it("the callback is a valid function", function () {
      expect(addBtn.onClick).toHaveBeenCalled();

      expect(typeof addBtn.callbackForLastOnClickCall()).toBe('function');
    });
    describe("when the button is clicked, the text field will be cleared and an event may be published", function () {
      testWillClearTheTextFieldAndPublishNewTaskRequestEvent(function () {
        return addBtn.callbackForLastOnClickCall()();
      });
    });
  });
  describe("will register a callback on the key up event of task description text field", function () {
    it("the callback is a valid function", function () {
      expect(descriptionTxtField.onKeyUp).toHaveBeenCalled();

      expect(typeof descriptionTxtField.callbackForLastOnKeyUpCall()).toBe('function');
    });
    describe("when the user do a keystroke on the text field", function () {
      it("won't happend anything if the key stroked is not enter", function () {
        descriptionTxtField.text.andReturn('not empty');

        descriptionTxtField.callbackForLastOnKeyUpCall()({keyCode:23});

        expect(newTaskRequestEvent.publish).not.toHaveBeenCalled();
      });
      describe("if the key stroked is enter,  the text field will be cleared and an event may be published", function () {
        testWillClearTheTextFieldAndPublishNewTaskRequestEvent(function () {
          return descriptionTxtField.callbackForLastOnKeyUpCall()({keyCode:13});
        });
      });
    });
  });
});