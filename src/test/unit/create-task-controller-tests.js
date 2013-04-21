"use strict";
var createAndBindWidgetForTask = require('../../lib/core/controller').createAndBindWidgetForTask,
    test = require('./test-doubles'),
    chai = require('chai'),
    expect = chai.expect;

chai.use(require('sinon-chai'));

describe("The function createAndBindWidgetForTask, when invoked with a task and a task list widget", function () {
  var task, taskListWidget, taskDTO, result, taskWidget;
  beforeEach(function () {
    taskDTO = test.spy('task dto');

    task = test.doubleFor('task');
    task.toDTO.returns(taskDTO);

    taskWidget = test.doubleFor('taskWidget');
    taskListWidget = test.doubleFor('appWidget');
    taskListWidget.newWidgetForTask.returns(taskWidget);

    result = createAndBindWidgetForTask(task, taskListWidget);
  });
  it("will ask the app widget to create a new widget for the task", function () {
    expect(taskListWidget.newWidgetForTask).to.have.been.calledWith(taskDTO);
  });
  it("will return the new task widget returned by the app widget", function () {
    expect(result).to.be.equal(taskWidget);
  });
  describe("will register on the event 'ToggleDoneRequest' of the new task widget", function () {
    it("a callback", function () {
      expect(taskWidget.onToggleDoneRequest).to.have.been.called;
      expect(taskWidget.callbackForLastOnToggleDoneRequestCall()).to.be.a('function');
    });
    describe("that when invoked with the new done state requested by the user", function () {
      var newDoneRequested;
      beforeEach(function () {
        newDoneRequested = true;
        taskWidget.callbackForLastOnToggleDoneRequestCall()(newDoneRequested);
      });
      it("will modify the task done state with the new done state requested", function () {
        expect(task.done).to.have.been.calledWith(newDoneRequested);
      });
      describe("and will save the task", function () {
        it("registering a callback", function () {
          expect(task.save).to.have.been.called;
          expect(task.callbackForLastSaveCall()).to.be.a('function');
        });
        it("that when invoked, will update the taskWidget done status", function () {
          task.done.returns(newDoneRequested);

          task.callbackForLastSaveCall()(task);

          expect(taskWidget.done).to.have.been.calledWith(newDoneRequested);
        });
      });
    });
  });
});