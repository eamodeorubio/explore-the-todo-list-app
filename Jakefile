var compactFiles, analyze
  , executeTestSuite = require('./src/build/runtests')
  , exec = require('child_process').exec
  , fs = require('fs')
  , commonSources = [
      'src/main/common/utils.js',
      'src/main/common/model.js',
      'src/main/common/controller.js',
      'src/main/common/widgets.js'
  ];

function listOfSources() {
  return [
    'src/main/common/utils.js',
    'src/main/common/store.js',
    'src/main/common/model.js',
    'src/main/common/controller.js',
    'src/main/common/widgets.js'
  ].concat(Array.prototype.slice.call(arguments));
}

function completion(task) {
  var start=new Date().getTime();
  return function() {
    console.log("Task '"+task.name+"' is completed ("+(((new Date()).getTime() - start) / 1000).toPrecision(3)+" seconds)");
    complete();
  };
}

function installModule(module, callback) {
  var cmd='npm install '+module;
  console.log("Installing locally the module "+module);
  console.log(cmd);
  var child=exec(cmd, function(err) {
    callback(err);
  });
  child.stdout.on('data', console.log.bind(console));
  child.stderr.on('data', console.error.bind(console));
}

function requireModule(module, callback) {
  try {
    if(fs.statSync('node_modules/'+module).isDirectory())
      callback();
    else
      installModule(module, callback);
  } catch(err) {
    installModule(module, callback);
  }
}

task('require-minimize', function() {
  requireModule('uglify-js', function(err) {
    if(err)
      console.log('Error installing uglify-js: %s', err);
    compactFiles=require('./src/build/minimize');
    complete();
  });
}, {async:true});

task('require-analyze', function() {
  requireModule('jshint', function(err) {
    if(err)
      console.log('Error installing jshint: %s', err);
    analyze=require('./src/build/analyze');
    complete();
  });
}, {async:true});

desc('Runs static code analysis on the sources. It uses JSHint.');
task('code-analysis', ['require-analyze'], function() {
  var start=new Date().getTime();
  var result=analyze(listOfSources(
      'src/main/zepto_jquery/viewmodels.js',
      'src/main/zepto_jquery/main.js',
      'src/main/knockout/viewmodels.js',
      'src/main/knockout/main.js',
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
      'src/tests/unit/field-tests.js',
      'src/build/analyze.js',
      'src/build/minimize.js',
      'src/build/runtests.js',
      'Jakefile'
  ), {
      bitwise: true, eqeqeq: true, forin: true, immed: true, strict: false,
      latedef: true, newcap: true, noarg: true, nonew: true, undef:true,
      trailing: true,
      laxcomma: true, validthis: true,
      browser: true, jquery: true, node: true,
      predef:[
        'ko', 'todo', 'Zepto', 'test', 'jasmine', 'afterEach', 'beforeEach', 'expect',
        'describe', 'it', 'xdescribe', 'xit', 'waits', 'waitsFor', 'runs', 'spyOn',
        'complete', 'desc', 'task', 'file', 'directory', 'jake'
      ]
  });
  this.passed=result.passed;
  if(!result.passed) {
    this.errorMsgs=result.errorMsgs;
    this.errorMsgs.forEach(function(error) {
      console.log(error);
    });
  }
  console.log("Task '"+this.name+"' is completed ("+(((new Date()).getTime() - start) / 1000).toPrecision(3)+" seconds)");
});

desc('Runs the unit tests of the project');
task('unit-tests', function() {
  var self=this, testsCompleted=completion(this);
  executeTestSuite('todo', listOfSources(
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
  ), function(result) {
    self.passed=result;
    testsCompleted();
  });
}, {async:true});

directory('js');

desc('Removes all the built files.');
task('clean', ['js'], function() {
  fs.readdirSync('js').forEach(function(fileName) {
    if(fileName.match(/.+\.min\.js$/)) {
      fs.unlinkSync('js/'+fileName);
      console.log('File js/'+fileName+' has been deleted');
    }
  });
  console.log("Task '"+this.name+"' is completed");
});

desc('Builds only the Knockout based production files of this project. Will not run neither tests nor code analysis.');
file('js/todo_with_ko.min.js', listOfSources(
          'js',
          'src/main/knockout/viewmodels.js',
          'src/main/knockout/main.js',
          'require-minimize'
        ), function() {
  compactFiles(listOfSources(
    'src/main/knockout/viewmodels.js',
    'src/main/knockout/main.js'
  ), 'js/todo_with_ko.min.js', completion(this));
}, {async:true});

desc('Builds only the Zepto/jQuery based production files of this project. Will not run neither tests nor code analysis.');
file('js/todo_with_zepto_jquery.min.js', listOfSources(
         'js',
         'src/main/zepto_jquery/zepto-api-fix.js',
         'src/main/zepto_jquery/viewmodels.js',
         'src/main/zepto_jquery/main.js',
         'require-minimize'
       ), function() {
  compactFiles(listOfSources(
    'src/main/zepto_jquery/zepto-api-fix.js',
    'src/main/zepto_jquery/viewmodels.js',
    'src/main/zepto_jquery/main.js'
  ), 'js/todo_with_zepto_jquery.min.js', completion(this));
}, {async:true});

desc('Builds all the production files of this project, but will not perform neither tests nor code analysis.');
task('minimize', ['js/todo_with_zepto_jquery.min.js', 'js/todo_with_ko.min.js']);

desc('Perform unit tests and code analysis. Tests are done first, and if they are all ok, then code analysis is run');
task('qa', ['unit-tests', 'require-analyze'], function() {
  var start=new Date().getTime();
  if(jake.Task['unit-tests'].passed) {
    var analyzeTask=jake.Task['code-analysis'];
    analyzeTask.invoke();
    this.passed=analyzeTask.passed;
    this.errorMsgs=analyzeTask.errorMsgs;
  } else {
    console.log('TESTS FAILED! Code analysis will not be performed');
    this.passed=false;
  }
  console.log("Task '"+this.name+"' is completed ("+(((new Date()).getTime() - start) / 1000).toPrecision(3)+" seconds)");
});

desc('Runs unit tests, and if all of them are ok, then will build the production files of this project');
task('build', ['qa'], function() {
  var buildCompleted=completion(this);
  if(jake.Task.qa.passed) {
    var minimizeTask=jake.Task.minimize;
    minimizeTask.on('complete', buildCompleted);
    minimizeTask.invoke();
  } else {
    console.log('QA FAILED! Compactation and minimification will not be performed');
    buildCompleted();
  }
}, {async:true});

desc("The default task points to 'build'");
task('default', ['build']);