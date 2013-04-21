"use strict";
var Tasks = require('../../lib/core/model').Tasks,
    test = require('./test-doubles'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

chai.use(require('sinon-chai'));

describe("A Tasks object, initialized with a store and a task factory", function () {
  var tasks, store, taskFactory;
  beforeEach(function () {
    store = test.doubleFor('store');
    taskFactory = sinon.stub();
    tasks = new Tasks(store, taskFactory);
  });

  describe("has a newTask method, that when invoked with a description and a callback", function () {
    var description, userCallback, newTask;
    beforeEach(function () {
      description = "new task description";
      userCallback = sinon.stub();
      newTask = test.doubleFor('task', 'new task');
      taskFactory.returns(newTask);
      tasks.newTask(description, userCallback);
    });
    it("will call the task factory with the description indicated as parameter and done state to false", function () {
      expect(taskFactory).to.have.been.calledWith({
        description: description,
        done: false
      });
    });
    it("will call the save method on the task created by the task factory with a save callback", function () {
      expect(newTask.save).to.have.been.called;
      expect(newTask.callbackForLastSaveCall()).to.be.a('function');
    });
    it("will call the save callback with the new task when newTask.save() finished", function () {
      newTask.callbackForLastSaveCall()(newTask);

      expect(userCallback).to.have.been.calledWith(newTask);
    });
  });

  describe("has a forEach method, that when invoked with a callback", function () {
    var userCallback;
    beforeEach(function () {
      userCallback = sinon.stub();
      tasks.forEach(userCallback);
    });
    it("will call the all method on the store with callback", function () {
      expect(store.all).to.have.been.called;
      expect(store.callbackForLastAllCall()).to.be.a('function');
    });
    describe("when the store invokes the callback with the found task dtos ", function () {
      var foundDTOs, foundTasks;
      beforeEach(function () {
        foundDTOs = [test.spy('task dto 1'), test.spy('task dto 2')];
        foundTasks = [test.doubleFor('task', 'found task 1'), test.doubleFor('task', 'found task 1')];

        taskFactory.withArgs(foundDTOs[0]).returns(foundTasks[0]);
        taskFactory.withArgs(foundDTOs[1]).returns(foundTasks[1]);

        store.callbackForLastAllCall()(foundDTOs);
      });
      it("the callback will call the task factory for each dto returned by the store", function () {
        expect(taskFactory.callCount).to.be.equal(2);

        expect(taskFactory.firstCall).to.have.been.calledWith(foundDTOs[0]);
        expect(taskFactory.secondCall).to.have.been.calledWith(foundDTOs[1]);
      });
      it("the callback will invoke the user's callback once for each returned task", function () {
        expect(userCallback.callCount).to.be.equal(2);

        expect(userCallback.firstCall).to.have.been.calledWith(foundTasks[0]);
        expect(userCallback.secondCall).to.have.been.calledWith(foundTasks[1]);
      });
    });
  });

  describe("has a forEach method, that can receive an optional second end callback", function () {
    var userCallback, endCallback;
    beforeEach(function () {
      userCallback = sinon.stub();
      endCallback = sinon.stub();
      tasks.forEach(userCallback, endCallback);
    });
    it("if no data, the end callback will be invoked", function () {
      store.callbackForLastAllCall()([]);

      expect(endCallback).to.have.been.called;
    });
    it("if data, the end callback will be invoked after the last task is provided", function () {
      var foundDTOs = [test.spy('task dto 1'), test.spy('task dto 2')];
      var foundTasks = [test.doubleFor('task', 'found task 1'), test.doubleFor('task', 'found task 1')];

      taskFactory.withArgs(foundDTOs[0]).returns(foundTasks[0]);
      taskFactory.withArgs(foundDTOs[1]).returns(foundTasks[1]);

      store.callbackForLastAllCall()(foundDTOs);

      expect(userCallback.callCount).to.be.equal(2);
      expect(endCallback).to.have.been.calledOnce;
      expect(endCallback).to.have.been.calledAfter(userCallback);
    });
  });
});