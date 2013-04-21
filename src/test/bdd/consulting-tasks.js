var bdd = bdd || {};
bdd.consultingTasks = function (newUI, expect) {
  "use strict";

  describe("The todo list apps allows to consult the tasks when the user enters the app", function () {
    var ui;

    beforeEach(function () {
      ui = newUI();
    });

    afterEach(function () {
      if (ui) {
        ui.dispose();
        ui = undefined;
      }
    });

    describe("Given the task list is empty", function () {
      beforeEach(function (done) {
        ui.emptyTheTaskList(done);
      });

      describe("and the page starts", function () {
        beforeEach(function (done) {
          ui.startApp(done);
        });

        it("it shows no tasks", function () {
          expect(ui.displayedTasks().length).to.be.equal(0);
        });
      });
    });

    describe("Given the task list is not empty", function () {
      var expectedTasks;
      beforeEach(function (done) {
        expectedTasks = [
          {text: 'task 1', done: false, inProgress: false},
          {text: 'task 2', done: true, inProgress: false},
          {text: 'task 3', done: false, inProgress: false}
        ];
        ui.setupTheTaskList(expectedTasks, done);
      });

      describe("and the page starts", function () {
        beforeEach(function (done) {
          ui.startApp(done);
        });

        it("it shows the saved tasks", function () {
          expect(ui.displayedTasks()).to.be.eql(expectedTasks);
        });
      });
    });
  });
};