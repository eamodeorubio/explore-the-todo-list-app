/*
 * Test doubles for the interfaces in the application
 */
var test = (function (ns) {
  ns = ns || {};

  var doubleFactories = {
    task:function (name) {
      var taskDouble = test.spy(name, ['save', 'toDTO', 'done']);
      taskDouble.callbackForLastSaveCall = function () {
        return this.save.mostRecentCall.args[0];
      };
      return taskDouble;
    },
    tasks:function (name) {
      var taskListDouble = test.spy(name, ['newTask', 'forEach']);
      taskListDouble.descriptionForLastNewTaskCall = function () {
        return this.newTask.mostRecentCall.args[0];
      };
      taskListDouble.callbackForLastNewTaskCall = function () {
        return this.newTask.mostRecentCall.args[1];
      };
      taskListDouble.callbackForLastForEachCall = function () {
        return this.forEach.mostRecentCall.args[0];
      };
      return taskListDouble;
    },
    store:function (name) {
      var storeDouble = test.spy(name, ['save', 'all']);
      storeDouble.dataForLastSaveCall = function () {
        return this.save.mostRecentCall.args[0];
      };
      storeDouble.callbackForLastSaveCall = function () {
        return this.save.mostRecentCall.args[1];
      };
      storeDouble.callbackForLastAllCall = function () {
        return this.all.mostRecentCall.args[0];
      };
      return storeDouble;
    },
    appWidget:function (name) {
      var appWidgetDouble = test.spy(name, ['attachToDOM', 'onNewTaskRequest', 'newWidgetForTask']);
      appWidgetDouble.callbackForLastOnNewTaskRequestCall = function () {
        return this.onNewTaskRequest.mostRecentCall.args[0];
      };
      return appWidgetDouble;
    },
    taskWidget:function (name) {
      var taskWidgetDouble = test.spy(name, ['onToggleDoneRequest', 'working', 'done']);
      taskWidgetDouble.callbackForLastOnToggleDoneRequestCall = function () {
        return this.onToggleDoneRequest.mostRecentCall.args[0];
      };
      return taskWidgetDouble;
    },
    createTaskWidget:function (name) {
      var createTaskWidgetDouble = test.spy(name, ['onNewTaskRequest']);
      createTaskWidgetDouble.focus = test.doubleFor('field', name + '.focus');
      createTaskWidgetDouble.callbackForLastOnNewTaskRequestCall = function () {
        return this.onNewTaskRequest.mostRecentCall.args[0];
      };
      return createTaskWidgetDouble;
    },
    textFieldViewModel:function (name) {
      var textFieldViewModelDouble = test.spy(name, ['onKeyUp']);
      textFieldViewModelDouble.text = test.doubleFor('field', name + '.text');
      textFieldViewModelDouble.focus = test.doubleFor('field', name + '.focus');
      textFieldViewModelDouble.callbackForLastOnKeyUpCall = function () {
        return this.onKeyUp.mostRecentCall.args[0];
      };
      return textFieldViewModelDouble;
    },
    taskViewModel:function (name) {
      var taskViewModelDouble = test.spy(name, ['onDescriptionClicked']);
      taskViewModelDouble.done = test.doubleFor('field', name + '.done');
      taskViewModelDouble.working = test.doubleFor('field', name + '.working');
      taskViewModelDouble.doneChk = test.doubleFor('checkboxViewModel', name + '.doneChk');
      taskViewModelDouble.callbackForLastOnDescriptionClickedCall = function () {
        return this.onDescriptionClicked.mostRecentCall.args[0];
      };
      return taskViewModelDouble;
    },
    checkboxViewModel:function (name) {
      var checkboxViewModelDouble = test.spy(name);
      checkboxViewModelDouble.enabled = test.doubleFor('field', name + '.enabled');
      checkboxViewModelDouble.checked = test.doubleFor('field', name + '.checked');
      return checkboxViewModelDouble;
    },
    buttonViewModel:function (name) {
      var buttonViewModelDouble = test.spy(name, ['onClick']);
      buttonViewModelDouble.enabled = test.doubleFor('field', name + '.enabled');
      buttonViewModelDouble.callbackForLastOnClickCall = function () {
        return this.onClick.mostRecentCall.args[0];
      };
      return buttonViewModelDouble;
    },
    appViewModel:function (name) {
      var viewModelDouble = test.spy(name, ['newViewForTask', 'attachToDOM']);
      viewModelDouble.newTaskDescription = test.doubleFor('textFieldViewModel', name + '.newTaskDescription');
      viewModelDouble.addTaskBtn = test.doubleFor('buttonViewModel', name + ".addTaskBtn");
      return viewModelDouble;
    },
    event:function (name) {
      var eventDouble = test.spy(name, ['subscribe', 'publish']);
      eventDouble.callbackForLastSubscribeCall = function () {
        return this.subscribe.mostRecentCall.args[0];
      };
      return eventDouble;
    },
    field:function (name) {
      var fieldDouble = jasmine.createSpy(name);
      fieldDouble.subscribe = jasmine.createSpy(name + ".subscribe");
      fieldDouble.callbackForLastSubscribeCall = function () {
        return this.subscribe.mostRecentCall.args[0];
      };
      return fieldDouble;
    }
  };

  ns.spy = function (name, methodNames) {
    methodNames = methodNames || [];
    var r = {'_description':name}
        , numberOfMethods = methodNames.length
        , methodName;
    for(var i = 0; i < numberOfMethods; i++) {
      methodName = methodNames[i];
      r[methodName] = jasmine.createSpy(name + "." + methodName);
    }
    r.toString = function () {
      return "test double <" + name + ">";
    }
    return r;
  };
  ns.doubleFor = function (objectType, optName) {
    var doubleFactory = doubleFactories[objectType];
    if(typeof doubleFactory !== 'function')
      throw new Error('No test double found for ' + objectType);
    return doubleFactory(optName || objectType);
  };
  return ns;
})(test);