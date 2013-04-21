/*
 * An Zepto/jQuery based ultrathin view layer for todo list application
 * The views translates DOM concepts to a plain JS Object in a cross browser fashion.
 * This way they decouples the rest of the application from the DOM and the presentation framework used.
 * In this sense you can think about them as a "DOM Access Layer".
 * In general they implement either a "Passive View" or a "View Model" pattern, so
 * they should have no logic. Main responsabilities:
 * - Sincronize JavaScript with DOM
 * - Capture low level user gestures (DOM events)
 * - Present a simple cross browser API to the upper layers
 */
module.exports = function ($, Event, field) {
  "use strict";
  function TextFieldViewModel($self, text, isFocused) {
    var keyUp = new Event();
    var textChanged = function (newText) {
      if (newText !== $self.val())
        $self.val(newText);
    };
    var focusChanged = function (isFocused) {
      if (isFocused)
        $self.focus();
    };

    var txt = this.text = field(text).subscribe(textChanged);
    this.onKeyUp = keyUp.subscribe.bind(keyUp);
    this.focus = field(isFocused).subscribe(focusChanged);

    // Init
    $self.keyup(function (ev) {
      txt($self.val());
      keyUp.publish(ev);
    });
    textChanged(txt());
    focusChanged(this.focus());
  }

  function ButtonViewModel($self, enabled) {
    var click = new Event();
    var enabledChanged = function (isEnabled) {
      if (isEnabled)
        $self.removeAttr("disabled");
      else
        $self.attr("disabled", true);
    };

    this.enabled = field(enabled).subscribe(enabledChanged);
    this.onClick = click.subscribe.bind(click);

    // Init
    $self.click(click.publish.bind(click));
    enabledChanged(this.enabled());
  }

  function CheckboxViewModel(isChecked, enabled, $self) {
    $self.removeAttr("checked");
    var enabledChanged = function (isEnabled) {
      if (isEnabled)
        $self.removeAttr("disabled");
      else
        $self.attr("disabled", true);
    };
    var checkedChanged = function (isChecked) {
      $self.prop("checked", isChecked);
    };

    this.enabled = field(enabled).subscribe(enabledChanged);
    var checked = this.checked = field(isChecked).subscribe(checkedChanged);

    // Init
    $self.change(function () {
      checked($self.prop('checked'));
    });
    enabledChanged(this.enabled());
    checkedChanged(checked());
  }

  function TaskViewModel(dto, $self) {
    var self = this,
        descriptionClicked = new Event(),
        $txt = $self.find('.txt');

    function doneChanged(isDone) {
      $self.toggleClass("done", isDone);
      $self.toggleClass("todo", !isDone);
    }

    function workingChanged(isWorking) {
      $self.toggleClass("working", isWorking);
    }

    function initAndBind() {
      $txt.click(descriptionClicked.publish.bind(descriptionClicked));
      $txt.text(dto.description);
      doneChanged(self.done());
      workingChanged(self.working());
    }

    self.done = field(dto.done).subscribe(doneChanged);
    self.working = field(false).subscribe(workingChanged);
    self.doneChk = new CheckboxViewModel(dto.done, !self.working(), $self.find('.chk'));
    self.onDescriptionClicked = descriptionClicked.subscribe.bind(descriptionClicked);
    self.appendToDOM = function ($container) {
      $container.append($self);
      $self.show();
    };

    initAndBind();
  }

  function TasksListViewModel($taskExamples) {
    var attached = false;
    var $self = $taskExamples.parent();
    var evenTaskExample = $taskExamples.filter(".even").first();
    var oddTaskExample = $taskExamples.filter(".odd").first();
    var taskViewModels = [];
    this.activate = function () {
      taskViewModels.forEach(function (viewForTask) {
        viewForTask.appendToDOM($self);
      });
      attached = true;
    };
    this.newViewForTask = function (dto) {
      var $example = taskViewModels.length % 2 === 0 ? evenTaskExample : oddTaskExample;
      var viewForTask = new TaskViewModel(dto, $example.clone());
      taskViewModels.push(viewForTask);
      if (attached)
        viewForTask.appendToDOM($self);
      return viewForTask;
    };

    $taskExamples.remove();
  }

  return function ($elementsMap) {
    this.newTaskDescription = new TextFieldViewModel($elementsMap.newTaskDescription, '', false);
    this.addTaskBtn = new ButtonViewModel($elementsMap.addTaskBtn, false);
    var tasksList = new TasksListViewModel($elementsMap.tasksList, '');

    this.newViewForTask = tasksList.newViewForTask.bind(tasksList);
    this.attachToDOM = tasksList.activate.bind(tasksList);
  };
};