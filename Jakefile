var compactFiles=require('./src/build/minimize')
  , executeTestSuite=require('./src/build/runtests')
  , fs=require('fs')
  , commonSources=[
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

desc('Builds only the Knockout production files of this project. Will not run any tests');
file('js/todo_with_ko.min.js', listOfSources(
          'js',
          'src/main/knockout/viewmodels.js',
          'src/main/knockout/main.js'
        ), function() {
  compactFiles(listOfSources(
    'src/main/knockout/viewmodels.js',
    'src/main/knockout/main.js'
  ), 'js/todo_with_ko.min.js', completion(this));
}, {async:true});

desc('Builds only the Zepto/jQuery production files of this project. Will not run any tests');
file('js/todo_with_zepto_jquery.min.js', listOfSources(
         'js',
         'src/main/zepto_jquery/zepto-api-fix.js',
         'src/main/zepto_jquery/viewmodels.js',
         'src/main/zepto_jquery/main.js'
       ), function() {
  compactFiles(listOfSources(
    'src/main/zepto_jquery/zepto-api-fix.js',
    'src/main/zepto_jquery/viewmodels.js',
    'src/main/zepto_jquery/main.js'
  ), 'js/todo_with_zepto_jquery.min.js', completion(this));
}, {async:true});

desc('Builds all the production files of this project without running any tests.');
task('minimize', ['js/todo_with_zepto_jquery.min.js', 'js/todo_with_ko.min.js']);

desc('Runs unit tests, and if all of them are ok, then will build the production files of this project');
task('build', ['unit-tests'], function(arg) {
  var buildCompleted=completion(this);
  if(jake.Task['unit-tests'].passed) {
    var minimizeTask=jake.Task['minimize'];
    minimizeTask.on('complete', buildCompleted);
    minimizeTask.invoke();
  } else {
    console.log('TESTS FAILED! Compactation and minimification will not be performed');
    buildCompleted();
  }
}, {async:true});

desc("The default task is 'build'");
task('default', ['build']);