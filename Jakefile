var compactFiles, analyze
    , executeTestSuite = require('./src/build/runtests')
    , exec = require('child_process').exec
    , fs = require('fs');

function collectSourceFilesInDir(sources, dirPath) {
  fs.readdirSync(dirPath).forEach(function (name) {
    var path = dirPath + '/' + name;
    var pathInfo = fs.statSync(path);
    if (pathInfo.isDirectory())
      collectSourceFilesInDir(sources, path);
    else if (pathInfo.isFile() && name.match(/.+\.js$/))
      sources.push(path);
  });
}

function commonSourceFiles() {
  var sources = [];
  collectSourceFilesInDir(sources, 'src/main/common');
  return sources;
}

function allSourceFiles() {
  var sources = ['Jakefile'];
  collectSourceFilesInDir(sources, 'src/main');
  collectSourceFilesInDir(sources, 'src/build');
  collectSourceFilesInDir(sources, 'src/tests/unit');
  collectSourceFilesInDir(sources, 'src/tests/utils');
  return sources;
}

function zeptoJQuerySourceFiles() {
  var sources = commonSourceFiles();
  // Must be this order
  sources.push('src/main/zepto_jquery/zepto-api-fix.js');
  sources.push('src/main/zepto_jquery/viewmodels.js');
  sources.push('src/main/zepto_jquery/main.js');
  return sources;
}

function koSourceFiles() {
  var sources = commonSourceFiles();
  // Must be this order
  sources.push('src/main/knockout/viewmodels.js');
  sources.push('src/main/knockout/main.js');
  return sources;
}

function unitTestSourceFiles() {
  var sources = commonSourceFiles();
  sources.push('src/tests/libs/larrymyers-jasmine-reporters/src/jasmine.console_reporter.js');
  sources.push('src/tests/libs/larrymyers-jasmine-reporters/src/jasmine.junit_reporter.js');
  collectSourceFilesInDir(sources, 'src/tests/utils');
  collectSourceFilesInDir(sources, 'src/tests/unit');
  return sources;
}

function completion(task) {
  var start = new Date().getTime();
  return function () {
    console.log("Task '" + task.name + "' is completed (" + (((new Date()).getTime() - start) / 1000).toPrecision(3) + " seconds)");
    complete();
  };
}

function installModule(module, callback) {
  var cmd = 'npm install ' + module;
  console.log("Installing locally the module " + module);
  console.log(cmd);
  var child = exec(cmd, function (err) {
    callback(err);
  });
  child.stdout.on('data', console.log.bind(console));
  child.stderr.on('data', console.error.bind(console));
}

function requireModule(module, callback) {
  try {
    if (fs.statSync('node_modules/' + module).isDirectory())
      callback();
    else
      installModule(module, callback);
  } catch (err) {
    installModule(module, callback);
  }
}

task('require-minimize', function () {
  requireModule('uglify-js', function (err) {
    if (err)
      console.log('Error installing uglify-js: %s', err);
    compactFiles = require('./src/build/minimize');
    complete();
  });
}, {async:true});

task('require-analyze', function () {
  requireModule('jshint', function (err) {
    if (err)
      console.log('Error installing jshint: %s', err);
    analyze = require('./src/build/analyze');
    complete();
  });
}, {async:true});

desc('Runs static code analysis on the sources. It uses JSHint.');
task('code-analysis', ['require-analyze'], function () {
  var start = new Date().getTime(), result, jshintConfig = {
    bitwise:true, eqeqeq:true, forin:true, immed:true, strict:false,
    latedef:true, nonew:true, noarg:true, undef:true,
    trailing:true,
    laxcomma:true, validthis:true
  };
  this.errorMsgs = [];
  this.passed = true;
  // Analyze common libs
  console.log('Analyzing code of the application core logic.');
  jshintConfig.nonew=true;
  jshintConfig.browser = false;
  jshintConfig.node = false;
  jshintConfig.jquery = false;
  jshintConfig.predef = ['todo', 'setTimeout', 'console'];
  result = analyze(commonSourceFiles(), jshintConfig);
  this.passed = this.passed && result.passed;
  this.errorMsgs = this.errorMsgs.concat(result.errorMsgs);
  // Analyze Zepto/jQuery libs
  console.log('Analyzing code of the Zepto/jQuery view models.');
  jshintConfig.browser = true;
  jshintConfig.jquery = true;
  jshintConfig.predef = ['todo'];
  result = analyze(['src/main/zepto_jquery/viewmodels.js',
    'src/main/zepto_jquery/main.js'], jshintConfig);
  this.passed = this.passed && result.passed;
  this.errorMsgs = this.errorMsgs.concat(result.errorMsgs);
  // Analyze Zepto api fix
  console.log('Analyzing code of the Zepto API fix.');
  jshintConfig.browser = true;
  jshintConfig.jquery = true;
  jshintConfig.newcap = false;
  jshintConfig.predef = ['Zepto'];
  result = analyze(['src/main/zepto_jquery/zepto-api-fix.js'], jshintConfig);
  this.passed = this.passed && result.passed;
  this.errorMsgs = this.errorMsgs.concat(result.errorMsgs);
  // Analyze KO libs
  console.log('Analyzing code of the Knockout view models.');
  jshintConfig.browser = true;
  jshintConfig.newcap = true;
  jshintConfig.jquery = false;
  jshintConfig.predef = ['todo', 'ko'];
  result = analyze(['src/main/knockout/viewmodels.js',
    'src/main/knockout/main.js'], jshintConfig);
  this.passed = this.passed && result.passed;
  this.errorMsgs = this.errorMsgs.concat(result.errorMsgs);
  // Analyze tests
  console.log('Analyzing code of the unit tests.');
  jshintConfig.browser = false;
  jshintConfig.jquery = false;
  jshintConfig.predef = ['todo', 'test', 'jasmine', 'afterEach', 'beforeEach', 'expect',
    'describe', 'it', 'xdescribe', 'xit', 'waits', 'waitsFor', 'runs', 'spyOn'];
  var testLibs = [];
  collectSourceFilesInDir(testLibs, 'src/tests/utils');
  collectSourceFilesInDir(testLibs, 'src/tests/unit');
  result = analyze(testLibs, jshintConfig);
  this.passed = this.passed && result.passed;
  this.errorMsgs = this.errorMsgs.concat(result.errorMsgs);
  // Analyze build system
  console.log('Analyzing code of the build system.');
  jshintConfig.node = true;
  jshintConfig.predef = ['complete', 'desc', 'task', 'file', 'directory', 'jake'];
  var buildLibs = ['Jakefile'];
  collectSourceFilesInDir(buildLibs, 'src/build');
  result = analyze(buildLibs, jshintConfig);
  this.passed = this.passed && result.passed;
  this.errorMsgs = this.errorMsgs.concat(result.errorMsgs);

  this.errorMsgs.forEach(function (error) {
    console.log(error);
  });

  console.log("Task '" + this.name + "' is completed (" + (((new Date()).getTime() - start) / 1000).toPrecision(3) + " seconds)");
});

desc('Runs the unit tests of the project');
task('unit-tests', function () {
  var self = this, testsCompleted = completion(this);
  executeTestSuite('todo', unitTestSourceFiles(), function (result) {
    self.passed = result;
    testsCompleted();
  });
}, {async:true});

directory('js');

desc('Removes all the built files.');
task('clean', ['js'], function () {
  fs.readdirSync('js').forEach(function (fileName) {
    if (fileName.match(/.+\.min\.js$/)) {
      fs.unlinkSync('js/' + fileName);
      console.log('File js/' + fileName + ' has been deleted');
    }
  });
  console.log("Task '" + this.name + "' is completed");
});

desc('Builds only the Knockout based production files of this project. Will not run neither tests nor code analysis.');
file('js/todo_with_ko.min.js', ['js', 'require-minimize'].concat(koSourceFiles()), function () {
  compactFiles(koSourceFiles(), 'js/todo_with_ko.min.js', completion(this));
}, {async:true});

desc('Builds only the Zepto/jQuery based production files of this project. Will not run neither tests nor code analysis.');
file('js/todo_with_zepto_jquery.min.js', ['js', 'require-minimize'].concat(zeptoJQuerySourceFiles()), function () {
  compactFiles(zeptoJQuerySourceFiles(), 'js/todo_with_zepto_jquery.min.js', completion(this));
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