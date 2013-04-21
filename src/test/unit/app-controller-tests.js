"use strict";
var AppController = require('../../lib/core/controller').AppController,
    test = require('./test-doubles'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

chai.use(require('sinon-chai'));

describe("The AppController, initialized with a task list model, a widget, a newTask and a taskWidgetFactory", function () {
  var controller, taskListModel, taskListWidget, taskWidgetFactory;
  beforeEach(function () {
    taskWidgetFactory = sinon.stub();
    taskListModel = test.doubleFor('tasks', 'taskListModel');
    taskListWidget = test.doubleFor('appWidget', 'taskListWidget');
    controller = new AppController(taskListModel, taskListWidget, taskWidgetFactory);
  });

  describe("has a start method, that when called", function () {
    var startcallback;
    beforeEach(function () {
      startcallback = sinon.stub();

      controller.start(startcallback);
    });

    describe("will call the forEach method of the model:", function () {
      it("with two callbacks", function () {
        expect(taskListModel.forEach).to.have.been.called;
        var lastCallArgs = taskListModel.forEach.lastCall.args;
        expect(lastCallArgs.length).to.be.equal(2);
        expect(lastCallArgs[0]).to.be.a('function');
        expect(lastCallArgs[1]).to.be.a('function');
      });

      describe("the first callback that when called with a task", function () {
        var task, callback;
        beforeEach(function () {
          task = test.doubleFor('task');
          callback = taskListModel.callbackForLastForEachCall();
        });

        it("will ask taskWidgetFactory to create a new widget for the task", function () {
          callback(task);

          expect(taskWidgetFactory).to.have.been.calledWith(task, taskListWidget);
        });
      });

      it("the second callback is the start application callback", function () {
        expect(taskListModel.forEach.lastCall.args[1]).to.be.equal(startcallback);
      });
    });

    describe("it will register on the event 'NewTaskRequest' of the widget", function () {
      it("a callback", function () {
        expect(taskListWidget.onNewTaskRequest).to.have.been.called;
        expect(taskListWidget.callbackForLastOnNewTaskRequestCall()).to.be.a('function');
      });
      describe("that when invoked with the requested task's description", function () {
        var description, taskWidget, task;
        beforeEach(function () {
          description = "requested task description";

          taskWidget = test.doubleFor('taskWidget');
          taskWidgetFactory.returns(taskWidget);

          task = test.doubleFor('task');
          taskListModel.newTask.returns(task);

          taskListWidget.callbackForLastOnNewTaskRequestCall()(description);
        });
        describe("will ask the model to create a new task", function () {
          it("with the description requested and a callback", function () {
            expect(taskListModel.newTask).to.have.been.called;
            expect(taskListModel.descriptionForLastNewTaskCall()).to.be.equal(description);
            expect(taskListModel.callbackForLastNewTaskCall()).to.be.a('function');
          });
          it("will ask taskWidgetFactory to create a new widget for the new task", function () {
            expect(taskWidgetFactory).to.have.been.calledWith(task, taskListWidget);
          });
          it("will update the working state of the new task widget to true", function () {
            expect(taskWidget.working).to.have.been.calledWith(true);
          });
          it("when the new task creation finished, the callback will update the task widget working state to false", function () {
            taskListModel.callbackForLastNewTaskCall()();

            expect(taskWidget.working).to.have.been.calledWith(false);
          });
        });
      });
    });
    it("will call attachToDOM on the widget", function () {
      expect(taskListWidget.attachToDOM).to.have.been.called;
    });
  });
});