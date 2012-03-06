describe("A Tasks object, initialized with a store and a task factory", function () {
  var tasks, store, taskFactory;
  beforeEach(function () {
    store = test.doubleFor('store');
    taskFactory = jasmine.createSpy('task factory');
    tasks = new todo.model.Tasks(store, taskFactory);
  });

  describe("has a newTask method, that when invoked with a description and a callback", function () {
    var description, userCallback, newTask;
    beforeEach(function () {
      description = "new task description";
      userCallback = jasmine.createSpy('new task callback');
      newTask = test.doubleFor('task', 'new task');
      taskFactory.andReturn(newTask);
      tasks.newTask(description, userCallback);
    });
    it("will call the task factory with the description indicated as parameter and done state to false", function () {
      expect(taskFactory).toHaveBeenCalledWith({
        description:description,
        done:false
      });
    });
    it("will call the save method on the task created by the task factory with a save callback", function () {
      expect(newTask.save).toHaveBeenCalled();
      expect(typeof newTask.callbackForLastSaveCall()).toBe('function');
    });
    it("will call the save callback with the new task when newTask.save() finished", function () {
      newTask.callbackForLastSaveCall()(newTask);

      expect(userCallback).toHaveBeenCalledWith(newTask);
    });
  });

  describe("has a forEach method, that when invoked with a callback", function () {
    var userCallback;
    beforeEach(function () {
      userCallback = jasmine.createSpy("forEach callback");
      tasks.forEach(userCallback);
    });
    it("will call the all method on the store with callback", function () {
      expect(store.all).toHaveBeenCalled();
      expect(typeof store.callbackForLastAllCall()).toBe('function');
    });
    describe("when the store invokes the callback with the found task dtos ", function () {
      var foundDTOs, taskFactoryCallCount, foundTasks;
      beforeEach(function () {
        foundTasks = [test.doubleFor('task', 'found task 1'), test.doubleFor('task', 'found task 1')];
        taskFactoryCallCount = 0;
        taskFactory.andCallFake(function () {
          return foundTasks[taskFactoryCallCount++];
        });
        foundDTOs = [test.spy('task dto 1'), test.spy('task dto 2')];
        store.callbackForLastAllCall()(foundDTOs);
      });
      it("the callback will call the task factory for each dto returned by the store", function () {
        expect(taskFactoryCallCount).toBe(2);

        expect(taskFactory.argsForCall[0][0]).toEqual(foundDTOs[0]);
        expect(taskFactory.argsForCall[1][0]).toEqual(foundDTOs[1]);
      });
      it("the callback will invoke the user's callback once for each returned task", function () {
        expect(userCallback.callCount).toBe(2);

        expect(userCallback.argsForCall[0][0]).toEqual(foundTasks[0]);
        expect(userCallback.argsForCall[1][0]).toEqual(foundTasks[1]);
      });
    });
  });
});