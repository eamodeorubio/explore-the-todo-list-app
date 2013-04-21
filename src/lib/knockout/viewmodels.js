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
module.exports = function (ko, Event) {
  "use strict";

  function TextFieldViewModel(text, isFocused) {
    var keyUp = new Event();

    this.text = ko.observable(text);
    this.onKeyUp = keyUp.subscribe.bind(keyUp);
    this.focus = ko.observable(isFocused);

    this.fireKeyUp = function (self, event) {
      keyUp.publish(event);
    };
  }

  function ButtonViewModel(enabled) {
    var click = new Event();

    this.enabled = ko.observable(enabled);
    this.onClick = click.subscribe.bind(click);

    this.fireOnClick = click.publish.bind(click);
  }

  function CheckboxViewModel(checked, enabled) {
    this.enabled = ko.observable(enabled);
    this.checked = ko.observable(checked);
  }

  function TaskViewModel(dto, even) {
    this.descriptionClicked = new Event();

    this.even = ko.observable(even);
    this.description = ko.observable(dto.description);

    this.done = ko.observable(dto.done);
    this.working = ko.observable(false);
    this.doneChk = new CheckboxViewModel(dto.done, !this.working());
    this.onDescriptionClicked = this.descriptionClicked.subscribe.bind(this.descriptionClicked);
  }

  return function () {
    this.taskViews = ko.observableArray([]);
    this.newTaskDescription = new TextFieldViewModel('', false);
    this.addTaskBtn = new ButtonViewModel(false);

    this.newViewForTask = function (dto) {
      var isEven = this.taskViews().length % 2 === 0;
      var viewForTask = new TaskViewModel(dto, isEven);
      this.taskViews.push(viewForTask);
      return viewForTask;
    };
    this.attachToDOM = function () {
      ko.applyBindings(this);
    };
  };
};