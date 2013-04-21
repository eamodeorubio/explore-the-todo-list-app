"use strict";
var TaskWidget = require('../../lib/core/widgets')(null).TaskWidget,
    test = require('./test-doubles'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

chai.use(require('sinon-chai'));

describe("A TaskWidget, initialized with a task view model and a 'ToggleDoneRequest' event", function () {
  var widget, taskViewModel, toggleDoneRequestEvent;
  beforeEach(function () {
    taskViewModel = test.doubleFor('taskViewModel');
    toggleDoneRequestEvent = test.doubleFor('event');

    widget = new TaskWidget(taskViewModel, toggleDoneRequestEvent);
  });

  it("has a onToggleDoneRequest method that register a callback into 'ToggleDoneRequest' event", function () {
    var callback = sinon.stub();

    widget.onToggleDoneRequest(callback);

    expect(toggleDoneRequestEvent.subscribe).to.have.been.calledWith(callback);
  });
  it("has a working method that is equivalent to calling working on the task view model", function () {
    var newWorkingValue = true;
    var expectedResult = "expected working result";
    taskViewModel.working.returns(expectedResult);

    var result = widget.working(newWorkingValue);

    expect(taskViewModel.working).to.have.been.calledWith(newWorkingValue);
    expect(result).to.be.equal(expectedResult);
  });
  it("has a done method that is equivalent to calling done on the task view model", function () {
    var newDoneValue = true;
    var expectedResult = "expected done result";
    taskViewModel.done.returns(expectedResult);

    var result = widget.done(newDoneValue);

    expect(taskViewModel.done).to.have.been.calledWith(newDoneValue);
    expect(result).to.be.equal(expectedResult);
  });
  describe("will register a callback on the task view model working change event", function () {
    it("the callback is a valid function", function () {
      expect(taskViewModel.working.subscribe).to.have.been.called;

      expect(taskViewModel.working.callbackForLastSubscribeCall()).to.be.a('function');
    });
    it("when working changes to true, it will disable the checkbox of the task view model", function () {
      taskViewModel.working.callbackForLastSubscribeCall()(true);

      expect(taskViewModel.doneChk.enabled).to.have.been.calledWith(false);
    });
    it("when working changes to false, it will enable the checkbox of the task view model", function () {
      taskViewModel.working.callbackForLastSubscribeCall()(false);

      expect(taskViewModel.doneChk.enabled).to.have.been.calledWith(true);
    });
  });
  describe("will register a callback on the task view model done change event", function () {
    it("the callback is a valid function", function () {
      expect(taskViewModel.done.subscribe).to.have.been.called;

      expect(taskViewModel.done.callbackForLastSubscribeCall()).to.be.a('function');
    });
    it("when done changes to any value, it will stop working", function () {
      var anyValue = true;

      taskViewModel.done.callbackForLastSubscribeCall()(anyValue);

      expect(taskViewModel.working).to.have.been.calledWith(false);
    });
  });
  describe("will register a callback on the click event of the task description and the check change of the task checkbox", function () {
    it("the callback for the checkbox is a valid function", function () {
      expect(taskViewModel.doneChk.checked.subscribe).to.have.been.called;

      expect(taskViewModel.doneChk.checked.callbackForLastSubscribeCall()).to.be.a('function');
    });
    it("the callback for the task description's click event is a valid function", function () {
      expect(taskViewModel.onDescriptionClicked).to.have.been.called;

      expect(taskViewModel.callbackForLastOnDescriptionClickedCall()).to.be.a('function');
    });
    it("both callbacks are the same", function () {
      expect(taskViewModel.callbackForLastOnDescriptionClickedCall())
          .to.be.equal(taskViewModel.doneChk.checked.callbackForLastSubscribeCall());
    });
    describe("when the user click on the task description or changes its checkbox", function () {
      it("won't do anything if the task widget is working", function () {
        taskViewModel.working.returns(true);

        taskViewModel.callbackForLastOnDescriptionClickedCall()();

        expect(toggleDoneRequestEvent.publish).not.to.have.been.called;
      });
      describe("if the task widget is not working", function () {
        var newDesiredDoneState;
        beforeEach(function () {
          newDesiredDoneState = true;
          taskViewModel.done.returns(!newDesiredDoneState);
          taskViewModel.working.returns(false);

          taskViewModel.callbackForLastOnDescriptionClickedCall()();
        });
        it("will update the checkbox with the desired done state", function () {
          expect(taskViewModel.doneChk.checked).to.have.been.calledWith(newDesiredDoneState);
        });
        it("will show the user her request is being processed (working=true)", function () {
          expect(taskViewModel.working).to.have.been.calledWith(true);
        });
        it("will publish a 'ToggleDoneRequest' event with the desired done state", function () {
          expect(toggleDoneRequestEvent.publish).to.have.been.calledWith(newDesiredDoneState);
        });
      });
    });
  });
});