function describeAddingANewTask(mainPage, newTaskDescription) {
  var expectedNewTask;

  beforeEach(function () {
    expectedNewTask = {
      text:newTaskDescription,
      done:false
    };
  });

  it("will see that the new task is being created", function () {
    expectedNewTask.inProgress = true;
    expect(mainPage().displayedTasks()).toEqual([expectedNewTask]);
  });

  it("will see that the new task is created after a short period of time", function () {
    waitsFor(function () {
      var tasks = mainPage().displayedTasks();
      return tasks.length === 1 && tasks[0].inProgress === false;
    }, "Task is not created or operation is too slow", 1000);

    runs(function () {
      expectedNewTask.inProgress = false;
      expect(mainPage().displayedTasks()).toEqual([expectedNewTask]);
    });
  });
}

describe("The todo list apps allows to add new tasks", function () {
  describe("Given the application has been started and there are no tasks yet", function () {
    var mainPage, started;
    beforeEach(function () {
      // Clean up!
      if (mainPage && started)
        mainPage.dispose();
      mainPage = undefined;
      started = undefined;

      runs(function () {
        test.mainPage(function (err, page) {
          if (err)
            started = false;
          else {
            mainPage = page;
            mainPage.emptyTheTaskList(function (err) {
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

    // afterEach is buggy with asynch tests and and asynch beforeEach
    //afterEach(function () {
    //  if (mainPage && started)
    //    mainPage.dispose();
    //  mainPage = undefined;
    //  started = undefined;
    //});

    it("the app has started", function () {
      expect(mainPage).toBeDefined();
      expect(started).toBe(true);
    });

    function getMainPage() {
      return mainPage;
    }

    describe("Given the user has specified the new task description as 'Hola'", function () {
      var newTaskDescription = 'Hola';
      beforeEach(function () {
        mainPage.fillNewTaskDescription(newTaskDescription);
      });
      describe("When the user request the task to be added using the keyboard", function () {
        beforeEach(function () {
          mainPage.requestNewTaskUsingKeyboard();
        });

        describeAddingANewTask(getMainPage, newTaskDescription);
      });
      describe("When the user request the task to be added without using the keyboard", function () {
        beforeEach(function () {
          mainPage.requestNewTaskWithoutKeyboard();
        });

        describeAddingANewTask(getMainPage, newTaskDescription);
      });
    });
  });
});