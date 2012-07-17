try {
  console.log(phantom.libraryPath);
  var loadOk = phantom.injectJs('../libs/jasmine-1.1.0/jasmine.js');
  if (!loadOk) {
    console.log('Could not load Jasmine');
    phantom.exit(-1);
  }
  console.log("Jasmine loaded ok");

  loadOk = phantom.injectJs('../utils/custom-reporter.js');
  if (!loadOk) {
    console.log('Could not load utils/custom-reporter.js');
    phantom.exit(-1);
  }
  console.log("Custom reporter loaded ok");

  loadOk = phantom.injectJs('../utils/page-objects.js');
  if (!loadOk) {
    console.log('Could not load utils/page-objects.js');
    phantom.exit(-1);
  }
  console.log("Page objects loaded ok");

  test.mainPageURL = phantom.libraryPath + '/../../../todo_with_zepto_jquery.html';

  loadOk = phantom.injectJs('consulting-tasks.js');
  if (!loadOk) {
    console.log('Could not load consulting-tasks.js');
    phantom.exit(-1);
  }
  console.log("Consulting tasks story loaded ok");
  jasmine.getEnv().addReporter(new CustomReporterWithCallback(function (isOk) {
    if (!isOk)
      console.log("Failed integrated test suite");
    phantom.exit(isOk ? 0 : -1);
  }));
  jasmine.getEnv().execute();
} catch (err) {
  console.log("Unexpected error: ", err);
  phantom.exit(-1);
}

