"use strict";

var sinon = require('sinon');

function spy(name, methodNames) {
  methodNames = methodNames || [];
  var r = { _description: name },
      numberOfMethods = methodNames.length,
      methodName;
  for (var i = 0; i < numberOfMethods; i++) {
    methodName = methodNames[i];
    r[methodName] = sinon.stub();
  }
  r.toString = function () {
    return "test double <" + name + ">";
  };
  return r;
}

var doubleFactories = {
  task: function (name) {
    var taskDouble = spy(name, ['save', 'toDTO', 'done']);
    taskDouble.callbackForLastSaveCall = function () {
      return this.save.lastCall.args[0];
    };
    return taskDouble;
  },
  tasks: function (name) {
    var taskListDouble = spy(name, ['newTask', 'forEach']);
    taskListDouble.descriptionForLastNewTaskCall = function () {
      return this.newTask.lastCall.args[0];
    };
    taskListDouble.callbackForLastNewTaskCall = function () {
      return this.newTask.lastCall.args[1];
    };
    taskListDouble.callbackForLastForEachCall = function () {
      return this.forEach.lastCall.args[0];
    };
    return taskListDouble;
  },
  store: function (name) {
    var storeDouble = spy(name, ['save', 'all']);
    storeDouble.dataForLastSaveCall = function () {
      return this.save.lastCall.args[0];
    };
    storeDouble.callbackForLastSaveCall = function () {
      return this.save.lastCall.args[1];
    };
    storeDouble.callbackForLastAllCall = function () {
      return this.all.lastCall.args[0];
    };
    return storeDouble;
  },
  appWidget: function (name) {
    var appWidgetDouble = spy(name, ['attachToDOM', 'onNewTaskRequest', 'newWidgetForTask']);
    appWidgetDouble.callbackForLastOnNewTaskRequestCall = function () {
      return this.onNewTaskRequest.lastCall.args[0];
    };
    return appWidgetDouble;
  },
  taskWidget: function (name) {
    var taskWidgetDouble = spy(name, ['onToggleDoneRequest', 'working', 'done']);
    taskWidgetDouble.callbackForLastOnToggleDoneRequestCall = function () {
      return this.onToggleDoneRequest.lastCall.args[0];
    };
    return taskWidgetDouble;
  },
  createTaskWidget: function (name) {
    var createTaskWidgetDouble = spy(name, ['onNewTaskRequest']);
    createTaskWidgetDouble.focus = doubleFor('field', name + '.focus');
    createTaskWidgetDouble.callbackForLastOnNewTaskRequestCall = function () {
      return this.onNewTaskRequest.lastCall.args[0];
    };
    return createTaskWidgetDouble;
  },
  textFieldViewModel: function (name) {
    var textFieldViewModelDouble = spy(name, ['onKeyUp']);
    textFieldViewModelDouble.text = doubleFor('field', name + '.text');
    textFieldViewModelDouble.focus = doubleFor('field', name + '.focus');
    textFieldViewModelDouble.callbackForLastOnKeyUpCall = function () {
      return this.onKeyUp.lastCall.args[0];
    };
    return textFieldViewModelDouble;
  },
  taskViewModel: function (name) {
    var taskViewModelDouble = spy(name, ['onDescriptionClicked']);
    taskViewModelDouble.done = doubleFor('field', name + '.done');
    taskViewModelDouble.working = doubleFor('field', name + '.working');
    taskViewModelDouble.doneChk = doubleFor('checkboxViewModel', name + '.doneChk');
    taskViewModelDouble.callbackForLastOnDescriptionClickedCall = function () {
      return this.onDescriptionClicked.lastCall.args[0];
    };
    return taskViewModelDouble;
  },
  checkboxViewModel: function (name) {
    var checkboxViewModelDouble = spy(name);
    checkboxViewModelDouble.enabled = doubleFor('field', name + '.enabled');
    checkboxViewModelDouble.checked = doubleFor('field', name + '.checked');
    return checkboxViewModelDouble;
  },
  buttonViewModel: function (name) {
    var buttonViewModelDouble = spy(name, ['onClick']);
    buttonViewModelDouble.enabled = doubleFor('field', name + '.enabled');
    buttonViewModelDouble.callbackForLastOnClickCall = function () {
      return this.onClick.lastCall.args[0];
    };
    return buttonViewModelDouble;
  },
  appViewModel: function (name) {
    var viewModelDouble = spy(name, ['newViewForTask', 'attachToDOM']);
    viewModelDouble.newTaskDescription = doubleFor('textFieldViewModel', name + '.newTaskDescription');
    viewModelDouble.addTaskBtn = doubleFor('buttonViewModel', name + ".addTaskBtn");
    return viewModelDouble;
  },
  event: function (name) {
    var eventDouble = spy(name, ['subscribe', 'publish']);
    eventDouble.callbackForLastSubscribeCall = function () {
      return this.subscribe.lastCall.args[0];
    };
    return eventDouble;
  },
  field: function () {
    var fieldDouble = sinon.stub();
    fieldDouble.subscribe = sinon.stub();
    fieldDouble.callbackForLastSubscribeCall = function () {
      return this.subscribe.lastCall.args[0];
    };
    return fieldDouble;
  }
};

function doubleFor(objectType, optName) {
  var doubleFactory = doubleFactories[objectType];
  if (typeof doubleFactory !== 'function')
    throw new Error('No test double found for ' + objectType);
  return doubleFactory(optName || objectType);
}

module.exports = {
  spy: spy,
  doubleFor: doubleFor
};
