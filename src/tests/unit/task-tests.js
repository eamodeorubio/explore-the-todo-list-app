describe("A Task object, initialized with a store and initial data", function () {
  var task, store, initialContents;
  beforeEach(function () {
    store = test.doubleFor('store');
    initialContents = {
      description:'a task description',
      done:false
    };
    task = new todo.model.Task(initialContents, store);
  });

  describe("has a toDTO method, that when invoked, an object is returned", function () {
    it("with the same contents as the task", function () {
      var dto = task.toDTO();

      expect(dto).toBeDefined();
      expect(dto).toEqual(initialContents);
    });
    it("which is a copy of the contents as the task", function () {
      var dto1 = task.toDTO();
      dto1.description = "XX";
      dto1.done = true;
      var dto = task.toDTO();

      expect(dto).toEqual(initialContents);
    });
  });

  describe("has a done method, that when invoked", function () {
    it("without parameters will return if it is done", function () {
      expect(task.done()).toBeFalsy();
    });
    describe("with parameters will change the done state of the task", function () {
      beforeEach(function () {
        task.done(true);
      });
      it("so done() will return the new value", function () {
        expect(task.done()).toBeTruthy();
      });
      it("toDTO() will reflect the new done state", function () {
        expect(task.toDTO().done).toBeTruthy();
      });
    });
  });

  describe("has a save method, that when invoked with a callback", function () {
    var callback;
    beforeEach(function () {
      callback = jasmine.createSpy("save callback");
      task.save(callback);
    });
    it("will call store.save(dto, storeCallback)", function () {
      expect(store.save).toHaveBeenCalled();
      expect(store.save.mostRecentCall.args.length).toBe(2);
      expect(store.dataForLastSaveCall()).toEqual(initialContents);
      expect(typeof store.callbackForLastSaveCall()).toBe('function');
    });
    it("when the store finished saving the task it will assign an id to the task", function () {
      var taskId = 'just assigned task id';

      store.callbackForLastSaveCall()({
        id:taskId
      });

      expect(task.toDTO().id).toBe(taskId);
    });
    it("when the store finished saving the callback will be invoked with the task itself", function () {
      var taskId = 'just assigned task id';

      store.callbackForLastSaveCall()({});

      expect(callback).toHaveBeenCalledWith(task);
    });
  });
});