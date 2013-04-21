$(function () {
  "use strict";
  var log = console.log.bind(console),
      LocalStorage = require('../core/store').LocalStorage,
      utils = require('../core/utils')(log),
      Event = utils.Event,
      AppViewModel = require('./viewmodels')($, Event, utils.field),
      Tasks = require('../core/model').Tasks,
      AppWidget = require('../core/widgets')(Event).AppWidget,
      AppController = require('../core/controller').AppController,
      app = new AppController(
          new Tasks(new LocalStorage()),
          new AppWidget(new AppViewModel({
            'tasksList': $('.task-list-widget .task-list .task'),
            'newTaskDescription': $('.add-task-widget .txt'),
            'addTaskBtn': $('.add-task-widget .btn')
          }))
      );
  app.start();
});

