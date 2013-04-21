"use strict";
var AppWidget = require('../../lib/core/widgets')(null).AppWidget,
    test = require('./test-doubles'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

chai.use(require('sinon-chai'));

describe("An AppWidget, initialized with a view model and a widget factory", function () {
  var widget, factory, viewModel, createTaskWidget;
  beforeEach(function () {
    createTaskWidget = test.doubleFor('createTaskWidget');

    factory = test.spy('factory', ['newCreateTaskWidget', 'newTaskWidget']);
    factory.newCreateTaskWidget.returns(createTaskWidget);

    viewModel = test.doubleFor('appViewModel');

    widget = new AppWidget(viewModel, factory);
  });
  it("will ask the factory to create a CreateTaskWidget", function () {
    expect(factory.newCreateTaskWidget).to.have.been.calledWith(viewModel.newTaskDescription, viewModel.addTaskBtn);
  });
  it("has a newWidgetForTask method that ask the factory to create a new TaskWidget", function () {
    var taskDTO = test.spy('task dto');
    var taskWidget = test.spy('task widget');
    var taskViewModel = test.spy('task view model');
    viewModel.newViewForTask.returns(taskViewModel);
    factory.newTaskWidget.returns(taskWidget);

    var result = widget.newWidgetForTask(taskDTO);

    expect(viewModel.newViewForTask).to.have.been.calledWith(taskDTO);
    expect(result).to.be.equal(taskWidget);
  });
  it("has an onNewTaskRequest that will register a callback into the 'NewTaskRequest' event of createTaskWidget", function () {
    var callback = sinon.stub();

    widget.onNewTaskRequest(callback);

    expect(createTaskWidget.onNewTaskRequest).to.have.been.calledWith(callback);
  });
  describe("has an attachToDOM method, that when called", function () {
    beforeEach(function () {
      widget.attachToDOM();
    });
    it("will call attachToDOM on the view model", function () {
      expect(viewModel.attachToDOM).to.have.been.called;
    });
    it("will call put focus on the createTaskWidget", function () {
      expect(createTaskWidget.focus).to.have.been.calledWith(true);
    });
  });
});