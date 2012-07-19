Another todo list application? Why bother...?
=============================================

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

The Data Access Layer decouples the models from the specifics storage mechanism used. Currently there is only support for a fake in memory storage. Notice, it fakes a 500ms. delay for all the operations, simulating the delay of an AJAX request. I plan to add more storage systems (localStore, AJAX, WebSockets...) only need to implement
 a new storage library. The rest of the code won't need to be changed.

TDD/BDD
=======

The core of the application code is fully unit tested. Furthermore there exists end to end integration tests for most of the use cases scenarios of the application. I didn't use any fancy BDD framework, but just Jasmine and PhantomJS.

The tests are integrated in a build script and generate JUnit XML report files, so I hope it will be easy to integrate with a CI server in the future.

If you have never seen TDD in practice in a full rich internet application, I hope this project helps you to
illustrate how to apply TDD in a web application based in javascript and HTML5.

Build
=====

To build this project follow these steps:

1. If not on your system, [install Node.js](http://nodejs.org/#download)
2. Newer versions of [Node.js](http://nodejs.org/#download) have already installed NPM. But if you have not yet NPM, don't wait and [install NPM](http://npmjs.org/).
3. If you plan to run the BDD integration tests install [PhantomJS](http://phantomjs.org/download.html)
4. Download this project to your computer
5. [Install Jake](https://github.com/mde/jake) if you have not yet installed it.
6. Execute the following command ``jake`` from the root folder of this project. To know all the build options issue ``jake -T``

By default the build process will perform only unit testing, static code analysis using JSHint and compactation and mimification to build the production ready files.
The first time you build the project, the packages [jshint](https://github.com/jshint/node-jshint) and [uglify-js](https://github.com/mishoo/UglifyJS) will be installed.

If you want to perform BDD testing issue either ``jake bdd`` or ``jake clean bdd``. This will trigger a full build, and then execute the BDD tests.


Execute
=======

After building the project, simply open in your browser either ``todo_with_knockout.html`` or ``todo_with_zepto_jquery.html``

Proyect layout
==============

The project is structured in the following directories:

* ```Jakefile``` The Jake build file of the project. It uses the build package inside this project.
* ```css/``` Simple CSS for the applications
* ```img/``` Some images (the ajax loader)
* ```js/``` The runtime code of the application
    * ```libs/``` Third party libs used in runtime (zepto, jQuery, knockout)
    * ```todo_with_ko.min.js``` Compacted minimified code resulting of the build process (You must build first)
    * ```todo_with_zepto_jquery.min.js``` Compacted minimified code resulting of the build process (You must build first)
* ```src/``` The source code for the application
    * ```build/``` A node package with an API to perform the build process. To be used with any node compatible build system.
        * ```lib/```
          * ``minimize.js`` Utilities to compact and minimize several source files using uglify-js
          * ``runtests.js`` Utilities that exposes a function to run jasmine tests
          * ``analyze.js`` Utilities to use JSHint to perform static code analysis
          * ``project.js`` The public API of the build system. It exposes the project structure as an object
        * ``package.json`` The descriptor of this node package
    * ```main/``` The source code for the runtime
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
        * ```libs/``` Third party libs used for testing (jasmine & Larry Myers' jasmine reporters)
        * ```utils/``` Custom utils for testing
            * ```custom-matchers.js``` Some custom matchers for jasmine
            * ```custom-reporter.js``` A console based reporter for jasmine. Compatible with Node.js and Phantom.js
            * ```page-objects.js``` A wrapper around phantom. It exposes a high level API that allows you to manipulate the UI of the application. The BDD tests are based on this API, so they are decoupled from Phantom.
            * ```test-doubles.js``` A test double (mocks/spies/stubs) library for the application
        * ```bdd/``` End to end tests of the application (BDD test suite)
            * ```bdd-suite.js``` The main script to be launched with phantom. It executes the BDD tests against the HTML specified as a command line argument
            * ```adding-tasks.js``` The BDD test suite about creating new tasks in the application
            * ```consulting-tasks.js``` The BDD test suite about consulting the existing tasks in the application
            * ```doing-tasks.js``` The BDD test suite about marking tasks as done or undone.
        * ```unit/``` Unit tests
            * ```suite.html``` A page to run unit tests (if you do not want to run them from the command line)
            * ```*-tests.js``` The unit test suites

Not yet done (in the roadmap)
=============================

There are a lot of things left to do !

* Use application cache manifest
* Edit the description of the task (click to edit)
* Task filters (view only done/todo)
* Task filters (matching description)
* A better web design (somebody help me with those damned CSS!)
* Responsive design
* An storage based in localStore
* An storage based in a remote REST service using AJAX
* An storage based in a remote service using WebSockets
* An robust storage able to switch to local storage when there is no connectivity and resync with the server when it
is online again
* Explore other presentation frameworks (ember.js, jquerymobile...?)
* Integrate build in a CI server (jenkins...?)

Feel free to experiment
=======================

If you are learning JavaScript and about building a rich web application, this is your project. Feel free to read the
code, modify it and experiment! This is the main purpose of this project !