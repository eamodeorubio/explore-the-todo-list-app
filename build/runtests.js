/*
 * A simple script to run the test suite
 * Simply call 'node build.js' in the shell from the root directory of the project
 */
var fs = require('fs')
    , jasminens = require('../src/tests/libs/jasmine-1.1.0/jasmine.js');

var CustomReporterWithCallback = function (callback, optIndenter) {
  optIndenter = optIndenter || '  ';
  var indent = 0;
  var self = this;
  var start;
  var printResults = function (tests, name, printOKResults) {
    var results = tests.results();
    if(results.passed()) {
      if(printOKResults)
        self.log(name + " all " + results.totalCount + " tests OK");
    }
    else
      self.log(name + " " + results.failedCount + " errors of " + results.totalCount + " tests");
  };
  this.reportRunnerResults = function (runner) {
    indent--;
    printResults(runner, "Test suite", true);
    this.log("Total test time " + (((new Date()).getTime() - start) / 1000).toPrecision(3) + " seconds");
    callback(runner.results().passed());
  };
  this.reportRunnerStarting = function (runner) {
    start = (new Date()).getTime();
    this.log("Test suite starting...");
    indent++;
  };
  this.reportSuiteResults = function (suite) {
    printResults(suite, suite.getFullName());
  };
  this.reportSpecResults = function (spec) {
    indent--;
    printResults(spec, spec.getFullName());
  };
  this.reportSpecStarting = function (spec) {
    indent++;
  };
  this.log = function (msg) {
    var r = [msg];
    for(var i = 0; i < indent; i++)
      r.unshift(optIndenter);
    console.log(r.join(''));
  };
};

var executeTestsInsideJasmineEnviroment = function (testCode, reporter) {
  (function (jasmine, afterEach, beforeEach, expect, describe, it, xdescribe, xit, waits, waitsFor, runs, spyOn) {
    eval(testCode);
  })(jasminens.jasmine
      , jasminens.afterEach
      , jasminens.beforeEach
      , jasminens.expect
      , jasminens.describe
      , jasminens.it
      , jasminens.xdescribe
      , jasminens.xit
      , jasminens.waits
      , jasminens.waitsFor
      , jasminens.runs
      , jasminens.spyOn);
};

var executeTestSuite = function (name, suitePaths, reporter) {
  var contents = [];
  suitePaths.forEach(function (path) {
    contents.push(fs.readFileSync(path, 'utf8'));
  });
  contents.push('jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter("' + name + '"))');
  contents.push('jasmine.getEnv().addReporter(reporter)');
  contents.push('jasmine.getEnv().execute()');
  executeTestsInsideJasmineEnviroment(contents.join(';'), reporter)
};

exports.executeTests = function (callback) {
  if(typeof callback !== 'function') {
    callback = function () {
      console.log("No callback supplied");
    };
  }
  executeTestSuite('todo', [
    'src/main/common/utils.js',
    'src/main/common/model.js',
    'src/main/common/controller.js',
    'src/main/common/widgets.js',
    'src/tests/libs/larrymyers-jasmine-reporters/src/jasmine.console_reporter.js',
    'src/tests/libs/larrymyers-jasmine-reporters/src/jasmine.junit_reporter.js',
    'src/tests/utils/custom-matchers.js',
    'src/tests/utils/test-doubles.js',
    'src/tests/unit/app-controller-tests.js',
    'src/tests/unit/create-task-controller-tests.js',
    'src/tests/unit/task-list-tests.js',
    'src/tests/unit/task-tests.js',
    'src/tests/unit/app-widget-tests.js',
    'src/tests/unit/create-task-widget-tests.js',
    'src/tests/unit/task-widget-tests.js',
    'src/tests/unit/event-tests.js',
    'src/tests/unit/field-tests.js'
  ], new CustomReporterWithCallback(callback));
};