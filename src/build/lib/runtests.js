var fs = require('fs')
    , vm = require('vm')
    , jasminens = require('../../tests/libs/jasmine-1.1.0/jasmine.js')
    , CustomReporterWithCallback = require('../../tests/utils/custom-reporter.js');

var executeTestsInsideJasmineEnviroment = function (name, testCode, reporter) {
  var testGlobals = {}, prop;
  for (prop in jasminens)
    if (Object.prototype.hasOwnProperty.call(jasminens, prop))
      testGlobals[prop] = jasminens[prop];
  for (prop in global)
    if (Object.prototype.hasOwnProperty.call(global, prop))
      testGlobals[prop] = global[prop];
  testGlobals.reporter = reporter;
  vm.runInNewContext(testCode, testGlobals, 'test-suite-' + name);
};

var executeTestSuite = function (name, suitePaths, reporter) {
  var contents = [];
  suitePaths.forEach(function (path) {
    contents.push(fs.readFileSync(path, 'utf8'));
  });
  contents.push('jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter("' + name + '"))');
  contents.push('jasmine.getEnv().addReporter(reporter)');
  contents.push('jasmine.getEnv().execute()');
  executeTestsInsideJasmineEnviroment(name, contents.join(';'), reporter);
};

module.exports = function (name, sourceFiles, callback) {
  if (typeof callback !== 'function') {
    callback = function () {
      console.log("No callback supplied");
    };
  }
  executeTestSuite(name, sourceFiles, new CustomReporterWithCallback(callback, jasminens.pp));
};