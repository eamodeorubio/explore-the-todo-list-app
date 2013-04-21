// Assemble MVC and start application
"use strict";

var log = console.log.bind(console),
    LocalStorage = require('../core/store').LocalStorage,
    utils = require('../core/utils')(log),
    Event = utils.Event,
    AppViewModel = require('./viewmodels')(window.ko, Event),
    Tasks = require('../core/model').Tasks,
    AppWidget = require('../core/widgets')(Event).AppWidget,
    AppController = require('../core/controller').AppController,
    app = new AppController(
        new Tasks(new LocalStorage()),
        new AppWidget(new AppViewModel())
    );

app.start();