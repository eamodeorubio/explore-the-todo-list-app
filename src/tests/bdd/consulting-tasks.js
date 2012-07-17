describe("The todo list apps allows to consult the tasks when the user enters the app", function () {
  var mainPage, error;
  beforeEach(function () {
    runs(function () {
      test.mainPage(function (err, page) {
        error = err;
        mainPage = page;
      });
    });

    waitsFor(function () {
      return mainPage || error;
    }, "Main page is not responding", 1000);
  });

  it("the page loads with no errors", function () {
    expect(mainPage).toBeDefined();
    expect(error).toBeFalsy();
  });

  afterEach(function () {
    if (mainPage && !error)
      mainPage.dispose();
    mainPage = null;
    error = null;
  });

  describe("Given the task list is empty", function () {
    var done;
    beforeEach(function () {
      runs(function () {
        mainPage.emptyTheTaskList(function (err) {
          done = !err;
        });
      });

      waitsFor(function () {
        return typeof done !== 'undefined';
      }, "Could not empty the task list", 1000);
    });

    it("the page has been setup to empty task list with no errors", function () {
      expect(done).toBeTruthy();
    });

    it("when the page starts it shows no tasks", function () {
      mainPage.startApplication();

      expect(mainPage.displayedTasks().length).toBe(0);
    });
  });

  describe("Given the task list is not empty", function () {
    var done, expectedTasks = [
      {text:'task 1', done:false},
      {text:'task 2', done:true},
      {text:'task 3', done:false}
    ];

    beforeEach(function () {
      runs(function () {
        mainPage.setupTheTaskList(expectedTasks, function (err) {
          done = !err;
        });
      });

      waitsFor(function () {
        return typeof done !== 'undefined';
      }, "Could not set up the initial task list", 1000);
    });

    it("the page has been setup to empty task list with no errors", function () {
      expect(done).toBeTruthy();
    });

    it("when the page starts it shows the saved tasks", function () {
      mainPage.startApplication();

      expect(mainPage.displayedTasks()).toEqual(expectedTasks);
    });
  });
});