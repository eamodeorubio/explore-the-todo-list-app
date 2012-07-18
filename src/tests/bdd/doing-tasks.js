function describeChangingATaskTo(mainPage, taskIndex, isDone, initialTasks) {
  var expectedToggledTask, expectedTasks;

  beforeEach(function () {
    expectedTasks = [];
    initialTasks().forEach(function (task) {
      var copy = {};
      copy.done = task.done;
      copy.text = task.text;
      copy.inProgress = task.inProgress;
      expectedTasks.push(copy);
    });
    expectedToggledTask = expectedTasks[taskIndex];
    expectedToggledTask.done = isDone;
  });

  it("will see that the new task is being created", function () {
    expectedToggledTask.inProgress = true;
    expect(mainPage().displayedTasks()).toEqual(expectedTasks);
  });

  it("will see that the new task is created after a short period of time", function () {
    waitsFor(function () {
      var tasks = mainPage().displayedTasks();
      return tasks.length === expectedTasks.length && tasks[taskIndex].inProgress === false;
    }, "Task is not created or operation is too slow", 1000);

    runs(function () {
      expectedToggledTask.inProgress = false;
      expect(mainPage().displayedTasks()).toEqual(expectedTasks);
    })
  });
}

describe("The todo list apps allows to add new tasks", function () {
  describe("Given the application has been started and there are some tasks", function () {
    var mainPage, started, initialTasks;
    beforeEach(function () {
      runs(function () {
        initialTasks = [
          {text:'task 1', done:false, inProgress:false},
          {text:'task 2', done:true, inProgress:false},
          {text:'task 3', done:false, inProgress:false}
        ];
        test.mainPage(function (err, page) {
          if (err)
            started = false;
          else {
            mainPage = page;
            mainPage.setupTheTaskList(initialTasks, function (err) {
              if (err)
                started = false;
              else {
                mainPage.startApplication(function () {
                  started = true;
                });
              }
            });
          }
        });
      });

      waitsFor(function () {
        return typeof mainPage !== 'undefined' && typeof started !== 'undefined';
      }, "Application is not responding", 2000);
    });

    afterEach(function () {
      if (mainPage && started)
        mainPage.dispose();
      mainPage = undefined;
      started = undefined;
    });

    it("the app has started", function () {
      expect(mainPage).toBeDefined();
      expect(started).toBe(true);
    });

    function getMainPage() {
      return mainPage;
    }

    function getInitialTasks() {
      return initialTasks;
    }

    describe("When the user request the 3rd task to be done", function () {
      describe("using the check", function () {
        beforeEach(function () {
          mainPage.requestToggleTaskUsingCheck(2, true);
        });

        describeChangingATaskTo(getMainPage, 2, true, getInitialTasks);
      });
    });

    describe("When the user request the 2rd task to be undone", function () {
      describe("using the check", function () {
        beforeEach(function () {
          mainPage.requestToggleTaskUsingCheck(1, false);
        });

        describeChangingATaskTo(getMainPage, 1, false, getInitialTasks);
      });
    });
  });
});