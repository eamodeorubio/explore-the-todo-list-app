/*
 * An knockout.js based ultrathin view layer for todo list application
 * The views translates DOM concepts to a plain JS Object in a cross browser fashion.
 * This way they decouples the rest of the application from the DOM and the presentation framework used.
 * In this sense you can think about them as a "DOM Access Layer".
 * In general they implement either a "Passive View" or a "View Model" pattern,
 * so they should have no logic. Main responsabilities:
 * - Sincronize JavaScript with DOM
 * - Capture low level user gestures (DOM events)
 * - Present a simple cross browser API to the upper layers
 */
var todo = (function (ns, undefined) {
  ns = ns || {};
  ns.view = ns.view || {};
  ns.view.ko = ns.view.ko || {};

  ns.view.ko.TextFieldViewModel = function (text, isFocused) {
    var keyUp = new ns.utils.Event();

    this.text = ko.observable(text);
    this.onKeyUp = keyUp.subscribe.bind(keyUp);
    this.focus = ko.observable(isFocused);

    this.fireKeyUp = function (self, event) {
      keyUp.publish(event);
    };
  };

  ns.view.ko.ButtonViewModel = function (enabled) {
    var click = new ns.utils.Event();

    this.enabled = ko.observable(enabled);
    this.onClick = click.subscribe.bind(click);

    this.fireOnClick = click.publish.bind(click);
  };

  ns.view.ko.CheckboxViewModel = function (checked, enabled) {
    this.enabled = ko.observable(enabled);
    this.checked = ko.observable(checked);
  };

  ns.view.ko.TaskViewModel = function (dto, even) {
    this.descriptionClicked = new ns.utils.Event();

    this.even = ko.observable(even);
    this.description = ko.observable(dto.description);

    this.done = ko.observable(dto.done);
    this.doneChk = new ns.view.ko.CheckboxViewModel(dto.done, false);
    this.working = ko.observable(false);
    this.onDescriptionClicked = this.descriptionClicked.subscribe.bind(this.descriptionClicked);
  };

  ns.view.ko.AppViewModel = function () {
    this.taskViews = ko.observableArray([]);
    this.newTaskDescription = new ns.view.ko.TextFieldViewModel('', false);
    this.addTaskBtn = new ns.view.ko.ButtonViewModel(false);

    this.newViewForTask = function (dto) {
      var isEven = this.taskViews().length % 2 === 0;
      var viewForTask = new ns.view.ko.TaskViewModel(dto, isEven);
      this.taskViews.push(viewForTask);
      return viewForTask;
    };
    this.attachToDOM = function () {
      ko.applyBindings(this);
    };
  };
  return ns;
})(todo);