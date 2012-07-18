try {
  var scripts = [
    {description:'Jasmine', path:'../libs/jasmine-1.1.0/jasmine.js'},
    {description:'JUnit reporter for jasmine', path:'../libs/larrymyers-jasmine-reporters/src/jasmine.junit_reporter.js'},
    {description:'Custom reporter for jasmine', path:'../utils/custom-reporter.js'},
    {description:'Page objects for application', path:'../utils/page-objects.js'},
    {description:'"User can consult the tasks" story test suite', path:'consulting-tasks.js'},
    {description:'"User can create new tasks" story test suite', path:'adding-tasks.js'},
    {description:'"User can do/undo tasks" story test suite', path:'doing-tasks.js'}
  ];

  function load(script) {
    var loadOk = phantom.injectJs(script.path);
    if (!loadOk) {
      console.log('Could not load ' + script.path);
      console.log('(ERROR) ' + script.description);
      phantom.exit(-1);
    }
    console.log('(OK) ' + script.description);
  }

  //Very, very nasty trick in order JUnitXmlReporter to work with phantom
  function fixJUnitReporter() {
    var fs = require('fs');

    __phantom_writeFile = function (path, data) {
      fs.write(path, data, "w");
    };
  }

  function setUpAndLaunchJasmine() {
    fixJUnitReporter();
    jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter('todo-BDD-'));
    jasmine.getEnv().addReporter(new CustomReporterWithCallback(function (isOk) {
      if (!isOk)
        console.log("Failed integrated test suite");
      phantom.exit(isOk ? 0 : -1);
    }));
    jasmine.getEnv().execute();
  }

  scripts.forEach(load);

  test.mainPageURL = phantom.libraryPath + '/../../../todo_with_zepto_jquery.html';

  setUpAndLaunchJasmine();

} catch (err) {
  console.log("Unexpected error: ", err);
  phantom.exit(-1);
}

