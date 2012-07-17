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

    runs(function () {
      expect(mainPage).toBeDefined();
      expect(error).toBeNull();
    });
  });

  afterEach(function () {
    if (mainPage && !error)
      mainPage.dispose();
  });

  describe("Given the task list is empty", function () {
    beforeEach(function () {
      var empty;
      runs(function () {
        mainPage.emptyTheTaskList(function (err) {
          empty = !err;
        });
      });

      waitsFor(function () {
        return typeof empty !== 'undefined';
      }, "Could not open main page", 1000);

      runs(function () {
        expect(empty).toBeTruthy();
      });
    });

    it("the page shows no tasks", function () {
      expect(mainPage.displayedTasks().length).toBe(0);
    });
  });
});