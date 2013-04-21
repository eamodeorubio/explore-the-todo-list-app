var bdd = bdd || {};
bdd.addingTasks = function (newUI, expect) {
  "use strict";

  function describeAddingANewTask(getUI, newTaskDescription) {
    var expectedNewTask;

    beforeEach(function () {
      expectedNewTask = {
        text: newTaskDescription,
        done: false
      };
    });

    it("will see that the new task is being created", function () {
      expectedNewTask.inProgress = true;
      expect(getUI().displayedTasks()).to.be.eql([expectedNewTask]);
    });

    it("will see that the new task is created after a short period of time", function (done) {
      expectedNewTask.inProgress = false;
      getUI().executeWhen(function () {
        var tasks = getUI().displayedTasks();
        return tasks.length === 1 && tasks[0].inProgress === false;
      }, function () {
        expect(getUI().displayedTasks()).to.be.eql([expectedNewTask]);
        done();
      });
    });
  }

  describe("The todo list apps allows to add new tasks", function () {
    context("Given the application has been started and there are no tasks yet", function () {
      var ui;

      beforeEach(function (done) {
        ui = newUI();
        ui.emptyTheTaskList(function (err) {
          if (err)
            return done(err);
          ui.startApp(done);
        });
      });

      afterEach(function () {
        if (ui) {
          ui.dispose();
          ui = undefined;
        }
      });

      it("the app has started", function () {
        expect(ui.isStarted()).to.be.ok;
      });

      function getUI() {
        return ui;
      }

      context("Given the user has specified the new task description as 'Hola'", function () {
        var newTaskDescription = 'Hola';
        beforeEach(function (done) {
          ui.fillNewTaskDescription(newTaskDescription, done);
        });
        describe("When the user request the task to be added using the keyboard", function () {
          beforeEach(function (done) {
            ui.requestNewTaskUsingKeyboard(done);
          });

          describeAddingANewTask(getUI, newTaskDescription);
        });
        describe("When the user request the task to be added without using the keyboard", function () {
          beforeEach(function (done) {
            ui.requestNewTaskWithoutKeyboard(done);
          });

          describeAddingANewTask(getUI, newTaskDescription);
        });
      });
    });
  });
};
