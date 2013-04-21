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
var todo = (function (ns, $, undefined) {
  ns = ns || {};
  ns.view = ns.view || {};
  ns.view.$ = ns.view.$ || {};

  var field = function (value) {
    return ns.utils.field(value);
  };

  ns.view.$.TextFieldViewModel = function ($self, text, isFocused) {
    var keyUp = new ns.utils.Event();
    var textChanged = function (newText) {
      if(newText !== $self.val())
        $self.val(newText);
    };
    var focusChanged = function (isFocused) {
      if(isFocused)
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
  };

  ns.view.$.ButtonViewModel = function ($self, enabled) {
    var click = new ns.utils.Event();
    var enabledChanged = function (isEnabled) {
      if(isEnabled)
        $self.removeAttr("disabled");
      else
        $self.attr("disabled", true);
    };

    this.enabled = field(enabled).subscribe(enabledChanged);
    this.onClick = click.subscribe.bind(click);

    // Init
    $self.click(click.publish.bind(click));
    enabledChanged(this.enabled());
  };

  ns.view.$.CheckboxViewModel = function (isChecked, enabled, $self) {
    $self.removeAttr("checked");
    var enabledChanged = function (isEnabled) {
      if(isEnabled)
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
  };

  ns.view.$.TaskViewModel = function (dto, $self) {
    var descriptionClicked = new ns.utils.Event()
        , $txt = $self.find('.txt');
    var doneChanged = function (isDone) {
      $self.toggleClass("done", isDone);
      $self.toggleClass("todo", !isDone);
    };
    var workingChanged = function (isWorking) {
      $self.toggleClass("working", isWorking);
    };

    this.done = field(dto.done).subscribe(doneChanged);
    this.working = field(false).subscribe(workingChanged);
    this.doneChk = new ns.view.$.CheckboxViewModel(dto.done, false, $self.find('.chk'));
    this.onDescriptionClicked = descriptionClicked.subscribe.bind(descriptionClicked);

    this.appendToDOM = function ($container) {
      $container.append($self);
      $self.show();
    };

    // Init
    $txt.click(descriptionClicked.publish.bind(descriptionClicked));
    $txt.text(dto.description);
    doneChanged(this.done());
    workingChanged(this.working());
  };

  ns.view.$.TasksListViewModel = function ($taskExamples) {
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
      var viewForTask = new ns.view.$.TaskViewModel(dto, $example.clone());
      taskViewModels.push(viewForTask);
      if(attached)
        viewForTask.appendToDOM($self);
      return viewForTask;
    };

    $taskExamples.remove();
  };

  ns.view.$.AppViewModel = function ($elementsMap) {
    this.newTaskDescription = new ns.view.$.TextFieldViewModel($elementsMap.newTaskDescription, '', false);
    this.addTaskBtn = new ns.view.$.ButtonViewModel($elementsMap.addTaskBtn, false);
    var tasksList = new ns.view.$.TasksListViewModel($elementsMap.tasksList, '');

    this.newViewForTask = tasksList.newViewForTask.bind(tasksList);
    this.attachToDOM = tasksList.activate.bind(tasksList);
  };
  return ns;
}(todo, window.Zepto || window.jQuery));