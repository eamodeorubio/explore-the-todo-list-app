var CustomReporterWithCallback = function (callback, optIndenter) {
  optIndenter = optIndenter || '  ';
  var indent = 0, start;

  function log(msg) {
    var r = [msg];
    for (var i = 0; i < indent; i++)
      r.unshift(optIndenter);
    console.log(r.join(''));
  }

  function printItemResult(itemResult) {
    if (itemResult.passed && !itemResult.passed()) {
      log("Expected <" + itemResult.expected + "> but was <" + itemResult.actual + ">");
      log(itemResult.trace);
    }
  }

  function printSpecResults(spec) {
    var results = spec.results();
    log(spec.description);
    indent++;
    var items = results.getItems();
    for (var k in items) {
      if (items.hasOwnProperty(k)) {
        printItemResult(items[k]);
      }
    }
    indent--;
  }

  function printSuiteResults(suite) {
    var results = suite.results();
    if (results.passed())
      return;
    log(suite.description);
    indent++;
    var specs = suite.specs();
    for (var i in specs) {
      if (specs.hasOwnProperty(i)) {
        printSpecResults(specs[i]);
      }
    }
    var suites = suite.suites();
    for (var j in suites) {
      if (suites.hasOwnProperty(j)) {
        printSuiteResults(suites[j]);
      }
    }
    indent--;
  }

  this.reportRunnerResults = function (runner) {
    var suites = runner.suites(), results = runner.results();
    for (var i in suites) {
      if (!suites[i].parentSuite) {
        printSuiteResults(suites[i]);
      }
    }
    if (!results.passed()) {
      log("Test failure!!!");
      log("(" + results.passedCount + ' tests of ' + results.totalCount + ' passed, ' + results.failedCount + ' failures)');
    } else
      log("All (" + results.totalCount + ") tests PASSED!!!");
    log("Total test time " + (((new Date()).getTime() - start) / 1000).toPrecision(3) + " seconds");
    callback(results.passed());
  };
  this.reportRunnerStarting = function (runner) {
    start = (new Date()).getTime();
    log("Test suite starting...");
  };

};
if (typeof module !== 'undefined' && module.exports)
  module.exports = CustomReporterWithCallback;