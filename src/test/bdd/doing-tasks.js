var bdd = bdd || {};
bdd.doingTasks = function (newUI, expect) {
  "use strict";

  function describeChangingATaskTo(getUI, taskIndex, isDone, initialTasks) {
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

    it("will see that the new task is being " + (isDone ? 'done' : 'undone'), function () {
      expectedToggledTask.inProgress = true;
      expect(getUI().displayedTasks()).to.be.eql(expectedTasks);
    });

    it("will see that the new task is " + (isDone ? 'done' : 'undone') + " after a short period of time", function (done) {
      getUI().executeWhen(function () {
        var tasks = getUI().displayedTasks();
        return tasks.length === expectedTasks.length && tasks[taskIndex].inProgress === false;
      }, function () {
        expectedToggledTask.inProgress = false;
        expect(getUI().displayedTasks()).to.be.eql(expectedTasks);
        done();
      });
    });
  }

  describe("The todo list apps allows to do/undo tasks", function () {
    describe("Given the application has been started and there are some tasks", function () {
      var ui, initialTasks;

      beforeEach(function (done) {
        initialTasks = [
          {text: 'task 1', done: false, inProgress: false},
          {text: 'task 2', done: true, inProgress: false},
          {text: 'task 3', done: false, inProgress: false}
        ];

        ui = newUI();
        ui.setupTheTaskList(initialTasks, function (err) {
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

      function getInitialTasks() {
        return initialTasks;
      }

      describe("When the user request the 3rd task to be done", function () {
        describe("using the check", function () {
          beforeEach(function (done) {
            ui.requestToggleTaskUsingCheck(2, done);
          });

          describeChangingATaskTo(getUI, 2, true, getInitialTasks);
        });

        describe("without using the check", function () {
          beforeEach(function (done) {
            ui.requestToggleTaskNotUsingCheck(2, done);
          });

          describeChangingATaskTo(getUI, 2, true, getInitialTasks);
        });
      });

      describe("When the user request the 2nd task to be undone", function () {
        describe("using the check", function () {
          beforeEach(function (done) {
            ui.requestToggleTaskUsingCheck(1, done);
          });

          describeChangingATaskTo(getUI, 1, false, getInitialTasks);
        });

        describe("without using the check", function () {
          beforeEach(function (done) {
            ui.requestToggleTaskNotUsingCheck(1, done);
          });

          describeChangingATaskTo(getUI, 1, false, getInitialTasks);
        });
      });
    });
  });
};