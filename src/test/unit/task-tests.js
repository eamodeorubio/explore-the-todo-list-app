"use strict";
var Task = require('../../lib/core/model').Task,
    test = require('./test-doubles'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

chai.use(require('sinon-chai'));

describe("A Task object, initialized with a store and initial data", function () {
  var task, store, initialContents;
  beforeEach(function () {
    store = test.doubleFor('store');
    initialContents = {
      description: 'a task description',
      done: false
    };
    task = new Task(initialContents, store);
  });

  describe("has a toDTO method, that when invoked, an object is returned", function () {
    it("with the same contents as the task", function () {
      var dto = task.toDTO();

      expect(dto).to.exist;
      expect(dto.description).to.be.equal(initialContents.description);
      expect(dto.done).to.be.equal(initialContents.done);
    });
    it("which is a copy of the contents as the task", function () {
      var dto1 = task.toDTO();
      dto1.description = "XX";
      dto1.done = true;
      var dto = task.toDTO();

      expect(dto.description).to.be.equal(initialContents.description);
      expect(dto.done).to.be.equal(initialContents.done);
    });
  });

  describe("has a done method, that when invoked", function () {
    it("without parameters will return if it is done", function () {
      expect(task.done()).not.to.be.ok;
    });
    describe("with parameters will change the done state of the task", function () {
      beforeEach(function () {
        task.done(true);
      });
      it("so done() will return the new value", function () {
        expect(task.done()).to.be.ok;
      });
      it("toDTO() will reflect the new done state", function () {
        expect(task.toDTO().done).to.be.ok;
      });
    });
  });

  describe("has a save method, that when invoked with a callback", function () {
    var callback;
    beforeEach(function () {
      callback = sinon.stub();
      task.save(callback);
    });
    it("will call store.save(dto, storeCallback)", function () {
      expect(store.save).to.have.been.called;
      expect(store.save.lastCall.args.length).to.be.equal(2);
      var dto = store.dataForLastSaveCall();
      expect(dto.description).to.be.equal(initialContents.description);
      expect(dto.done).to.be.equal(initialContents.done);
      expect(store.callbackForLastSaveCall()).to.be.a('function');
    });
    it("when the store finished saving the task it will assign an id to the task", function () {
      var taskId = 'just assigned task id';

      store.callbackForLastSaveCall()({
        id: taskId
      });

      expect(task.toDTO().id).to.be.equal(taskId);
    });
    it("when the store finished saving the callback will be invoked with the task itself", function () {
      store.callbackForLastSaveCall()({});

      expect(callback).to.have.been.calledWith(task);
    });
  });
});