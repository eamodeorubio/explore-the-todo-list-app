Another todo list application? Why bother...?
=============================================

[![Build Status](https://secure.travis-ci.org/eamodeorubio/explore-the-todo-list-app.png)](http://travis-ci.org/eamodeorubio/explore-the-todo-list-app)

All the todo list applications I've seen have the purpose of showing the "easy to use" a framework are. In this case
I simply don't want to proof that a framework is better than other.

Since I teach TDD/BDD, Javascript and OO, I'd like to show to my students best practices to develop rich
internet applications, and the todo list application is simple enough to show key concepts. So I think it's a good
idea publishing a full sample project showing this concepts.

**Of course I'm not perfect, the application can have errors or something could have been done in a better way**. This
 is my second motivation, to learn. I expect to get some feedback to enhance this sample application ! I can lear too
  new ideas and techniches.

Finally I'd like to explore some frameworks and how to use them in an efective way.

Framework agnostic architecture
===============================

A well designed architecture should give you the freedom of switching the framework used without impacting most of
your code. In this project I'd tried to decouple most of the code from any framework.

DOM Access Layer
----------------

The DOM Access Layer decouple the core of the application from the specifics of DOM manipulation. In this case I use
"view models" to implement this layer. There is an implementation of these "view models" using knockout.js,
and other using Zepto/jQuery. Switching from one framework to another is only matter of switching the "view
model" library used. If in the future we wish to change the presentation framework we only need to implement a new
"view model" library.

It's interesting comparing both implementations of the DOM Access Layer. Clearly knockout.js seems more powerful,
the view layer is very simple to code. With Zepto/jQuery the view layer is more complex,
but I don't need to modify the HTML and I can use the same document as provided by the web designer. Another advantage of
 Zepto/jQuery is that the final result has less footprint and less start up time, specially in the case of Zepto.

Data Access Layer
-----------------

The Data Access Layer decouples the models from the specifics storage
mechanism used. Currently there is only support for local storage. I plan to
add more storage systems (AJAX, WebSockets...) only need to implement a new
storage library. The rest of the code won't need to be changed.

TDD/BDD
=======

The core of the application code is fully unit tested. Furthermore there exists end to end integration tests for most of the use cases scenarios of the application. I didn't use any fancy BDD framework, but just Jasmine and PhantomJS.

The tests are integrated in a build script and generate JUnit XML report files, so I hope it will be easy to integrate with a CI server in the future.

If you have never seen TDD in practice in a full rich internet application, I hope this project helps you to
illustrate how to apply TDD in a web application based in javascript and HTML5.

Build
=====

Standalone build
----------------

To build this project follow these steps:

1. If not on your system, [install Node.js](http://nodejs.org/#download). It has already installed NPM.
2. If you plan to run the BDD integration tests install [PhantomJS]
(http://phantomjs.org/download.html)
3 Uninstall old version of grunt `npm uninstall -g grunt`
4. Install grunt-cli: `npm install -g grunt-cli`
5. Download this project to your computer
6. Install all the packages needed to build this application, it's easy,
simply run the command ``npm install`` in the root of the project
7. Execute the following command ``npm test`` from the root folder of this
project.

Travis CI
---------

This project is now integrated with travis CI. Have a look at the ``.travis.yml`` file and the ``package.json`` file at the root of the project

Execute
=======

After building the project, simply open in your browser either
``todo_with_knockout.html`` or ``todo_with_zepto.html`` or ``todo_with_jquery
.html``. Do this from the `dist/` directory.

Proyect layout
==============

The project is structured in the following directories:

* ```package.json``` The node information used by npm and Travis-CI when you want to build this project with them
* ```.travis.yml``` The Travis-CI configuration file for this project
* ```karma.conf.js``` The karma configuration file (for BDD test suite)
* ```Gruntfile.js``` The grunt configuration file
* ```dist/``` The output directory
* ```src/``` The source code for the application
    * ```css/``` Simple CSS for the applications
    * ```img/``` Some images (the ajax loader)
    * ```lib/``` The source code for the runtime
        * ```common/``` The source code of the core of the application, decoupled from the DOM/Presentation framework
used. The unit tests cover this files, except store.js.
            * ```utils.js``` Event & observable fields (whenever I do not have knockout)
            * ```model.js``` A Task & Tasks (task list) model. Decoupled of the specific persistence/storage mechanism
            * ```controller.js``` The high level application controller
            * ```widgets.js``` Reusable controllers/widgets. Decoupled from the specific presentation framework
            * ```store.js``` A simple in memory storage.
        * ```knockout/``` The view models implemented with [Knockout.js](http://knockoutjs.com/)
        * ```zepto_jquery/``` The view models implemented with [Zepto](http://zeptojs.com/)/[jQuery](http://docs.jquery
.com/Downloading_jQuery)
    * ```tests/``` The source code for the tests
        * ```bdd/``` End to end tests of the application (BDD test suite)
            * ```vendor/``` Third party libs used for testing (jQuery,
            jQuery-simulate & jQuery-simulate.key-sequence)
            * ```main.js``` The entry point for the tdd
            * ```adding-tasks.js``` The BDD test suite about creating new tasks in the application
            * ```consulting-tasks.js``` The BDD test suite about consulting the existing tasks in the application
            * ```doing-tasks.js``` The BDD test suite about marking tasks as done or undone.
            * ```page-objects.js``` A wrapper around the application's UI
            using jQuery, jQuery simulate and jQuery simulate key-sequece
        * ```unit/``` Unit tests
            * ```test-doubles.js``` A test double (mocks/spies/stubs) library for the application
            * ```*-tests.js``` The unit test suites


Not yet done (in the roadmap)
=============================

There are a lot of things left to do !

* Use bower for client-side dependencies
* Use application cache manifest
* Edit the description of the task (click to edit)
* Task filters (view only done/todo)
* Task filters (matching description)
* A better web design (somebody help me with those damned CSS!)
* Responsive design
* An storage based in a remote REST service using AJAX
* An storage based in a remote service using WebSockets
* An robust storage able to switch to local storage when there is no connectivity and resync with the server when it
is online again
* Explore other presentation frameworks (ember.js, jquerymobile...?)

Feel free to experiment
=======================

If you are learning JavaScript and about building a rich web application, this is your project. Feel free to read the
code, modify it and experiment! This is the main purpose of this project !