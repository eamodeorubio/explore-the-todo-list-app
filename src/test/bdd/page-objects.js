var bdd = bdd || {};
bdd.UI = function (tech, $) {
  "use strict";
  var childDOC,
      STORE_ID = 'todo.store';

  this.startApp = function (done) {
    $('body').append('<iframe id="fr1" name="fr1"></iframe>');
    $('#fr1').load(function () {
      childDOC = this.contentDocument;
      // TODO: fixme -- we should find a proper way of waiting, maybe with an started callack/event?
      setTimeout(done, 100); // Wait for KO and STORE
    });
    $('#fr1').attr('src', "/base/dist/todo_with_" + tech + ".html");
  };

  this.isStarted = function () {
    return !!childDOC;
  };

  this.executeWhen = function (condition, action) {
    function check() {
      if (condition())
        return action();
      setTimeout(check, 10);
    }

    check();
  };

  this.dispose = function () {
    childDOC = null;
    $('#fr1').contents().remove();
    $('#fr1').remove();
  };

  this.emptyTheTaskList = function (done) {
    localStorage.removeItem(STORE_ID);
    done();
  };

  this.setupTheTaskList = function (initialTasks, done) {
    localStorage.setItem(STORE_ID, JSON.stringify(initialTasks.map(function (task) {
      return JSON.stringify({
        id: task.id,
        description: task.text,
        inProgress: task.inProgress,
        done: task.done
      });
    })));
    done();
  };

  this.displayedTasks = function () {
    if (!childDOC)
      throw 'UI not started!';
    var tasks = [];
    $('.task-list > .task', childDOC).each(function () {
      var el = $(this), task = {};
      task.text = el.find('.txt').first().text();
      task.done = el.find('.chk').first().prop('checked');
      task.inProgress = el.hasClass('working');
      tasks.push(task);
    });
    return tasks;
  };

  this.requestToggleTaskUsingCheck = function (taskIndex, done) {
    if (!childDOC)
      return done('UI not started!');
    $('.task-list > .task', childDOC).eq(taskIndex).find('.chk').simulate('click', {bubbles: true});
    done();
  };

  this.requestToggleTaskNotUsingCheck = function (taskIndex, done) {
    if (!childDOC)
      return done('UI not started!');
    $('.task-list > .task', childDOC).eq(taskIndex).find('.txt').simulate('click', {bubbles: true});
    done();
  };

  this.fillNewTaskDescription = function (text, done) {
    if (!childDOC)
      return done('UI not started!');
    $('.add-task-widget > .txt', childDOC).focus().val('').simulate("key-sequence", {
      sequence: text,
      callback: function () {
        // Remove argument!
        done();
      }
    });
  };

  this.requestNewTaskUsingKeyboard = function (done) {
    if (!childDOC)
      return done('UI not started!');
    $('.add-task-widget > .txt', childDOC).focus().simulate("key-sequence", {
      sequence: "{enter}",
      callback: function () {
        // Remove argument!
        done();
      }
    });
  };

  this.requestNewTaskWithoutKeyboard = function (done) {
    if (!childDOC)
      return done('UI not started!');
    $(".add-task-widget > .btn", childDOC).simulate('click', {bubbles: true});
    done();
  };
};