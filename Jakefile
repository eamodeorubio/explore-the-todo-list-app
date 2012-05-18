var project = require('./src/build');

function completion(task) {
  var start = new Date().getTime();
  return function () {
    console.log("Task '" + task.name + "' is completed (" + (((new Date()).getTime() - start) / 1000).toPrecision(3) + " seconds)");
    complete();
  };
}

task('require-analyze', function () {
  project.makeSureJsHintIsInstalled(complete);
}, {async:true});

desc('Runs static code analysis on the sources. It uses JSHint.');
task('code-analysis', ['require-analyze'], function () {
  var start = new Date().getTime();
  this.errorMsgs = [];
  this.passed = project.codeAnalysis(this.errorMsgs);
  this.errorMsgs.forEach(function (error) {
    console.log(error);
  });
  console.log("Task '" + this.name + "' is completed (" + (((new Date()).getTime() - start) / 1000).toPrecision(3) + " seconds)");
});

desc('Runs the unit tests of the project');
task('unit-tests', function () {
  var self = this, testsCompleted = completion(this);
  project.executeUnitTests(function (result) {
    self.passed = result;
    testsCompleted();
  });
}, {async:true});

directory('js');

desc('Removes all the built files.');
task('clean', ['js'], function () {
  project.clean();
  console.log("Task '" + this.name + "' is completed");
});

desc('Builds only the Knockout based production files of this project. Will not run neither tests nor code analysis.');
file('js/todo_with_ko.min.js', ['js'].concat(project.ko.sources()), function () {
  project.ko.minimize(completion(this));
}, {async:true});

desc('Builds only the Zepto/jQuery based production files of this project. Will not run neither tests nor code analysis.');
file('js/todo_with_zepto_jquery.min.js', ['js'].concat(project.zeptoJQuery.sources()), function () {
  project.zeptoJQuery.minimize(completion(this));
}, {async:true});

desc('Builds all the production files of this project, but will not perform neither tests nor code analysis.');
task('minimize', ['js/todo_with_zepto_jquery.min.js', 'js/todo_with_ko.min.js']);

desc('Perform unit tests and code analysis. Tests are done first, and if they are all ok, then code analysis is run');
task('qa', ['unit-tests', 'require-analyze'], function () {
  var start = new Date().getTime();
  if (jake.Task['unit-tests'].passed) {
    var analyzeTask = jake.Task['code-analysis'];
    analyzeTask.invoke();
    this.passed = analyzeTask.passed;
    this.errorMsgs = analyzeTask.errorMsgs;
  } else {
    console.log('TESTS FAILED! Code analysis will not be performed');
    this.passed = false;
  }
  console.log("Task '" + this.name + "' is completed (" + (((new Date()).getTime() - start) / 1000).toPrecision(3) + " seconds)");
});

desc('Runs unit tests, and if all of them are ok, then will build the production files of this project');
task('build', ['qa'], function () {
  var buildCompleted = completion(this);
  if (jake.Task.qa.passed) {
    var minimizeTask = jake.Task.minimize;
    minimizeTask.on('complete', buildCompleted);
    minimizeTask.invoke();
  } else {
    console.log('QA FAILED! Compactation and minimification will not be performed');
    buildCompleted();
  }
}, {async:true});

desc("The default task points to 'build'");
task('default', ['build']);