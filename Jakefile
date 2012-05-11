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

var codeAnalyzer = function (sourceFiles, jsHintConfig) {
  return function (errorMsgs) {
    var result = analyze(sourceFiles, jsHintConfig);
    if (errorMsgs)
      Array.prototype.push.apply(errorMsgs, result.errorMsgs);
    return result.passed;
  };
};

var coreLogic = function () {
  var sourceFiles = [];
  collectSourceFilesInDir(sourceFiles, 'src/main/common');

  return {
    codeAnalysis:codeAnalyzer(sourceFiles, {
      bitwise:true, eqeqeq:true, forin:true, immed:true, strict:false,
      latedef:true, nonew:true, noarg:true, undef:true,
      trailing:true, laxcomma:true, validthis:true,

      newcap:true, browser:false, node:false, jquery:false,
      predef:['todo', 'setTimeout', 'console']
    }),
    sources:function () {
      return sourceFiles.slice(0);
    }
  };
};

var zeptoJQueryViewModels = function () {
  var sourceFiles = [
    'src/main/zepto_jquery/viewmodels.js',
    'src/main/zepto_jquery/main.js'
  ];

  return {
    codeAnalysis:codeAnalyzer(sourceFiles, {
      bitwise:true, eqeqeq:true, forin:true, immed:true, strict:false,
      latedef:true, nonew:true, noarg:true, undef:true,
      trailing:true, laxcomma:true, validthis:true,

      newcap:true, browser:true, node:false, jquery:true,
      predef:['todo']
    }),
    sources:function() {
      return sourceFiles.slice(0);
    }
  };
};

var zeptoApiFix = function () {
  var sourceFiles = ['src/main/zepto_jquery/zepto-api-fix.js'];

  return {
    codeAnalysis:codeAnalyzer(sourceFiles, {
      bitwise:true, eqeqeq:true, forin:true, immed:true, strict:false,
      latedef:true, nonew:true, noarg:true, undef:true,
      trailing:true, laxcomma:true, validthis:true,

      newcap:false, browser:true, node:false, jquery:true,
      predef:['Zepto']
    }),
    sources:function() {
      return sourceFiles.slice(0);
    }
  };
};

var unitTestSystem = function () {
  var sourceFiles = [];
  collectSourceFilesInDir(sourceFiles, 'src/tests/utils');
  collectSourceFilesInDir(sourceFiles, 'src/tests/unit');

  return {
    codeAnalysis:codeAnalyzer(sourceFiles, {
      bitwise:true, eqeqeq:true, forin:true, immed:true, strict:false,
      latedef:true, nonew:true, noarg:true, undef:true,
      trailing:true, laxcomma:true, validthis:true,

      newcap:true, browser:false, node:false, jquery:false,
      predef:['todo', 'test', 'jasmine', 'afterEach', 'beforeEach', 'expect',
        'describe', 'it', 'xdescribe', 'xit', 'waits', 'waitsFor', 'runs', 'spyOn']
    }),
    execute:function (moduleToTest, callback) {
      var sources = moduleToTest.sources();
      sources.push('src/tests/libs/larrymyers-jasmine-reporters/src/jasmine.console_reporter.js');
      sources.push('src/tests/libs/larrymyers-jasmine-reporters/src/jasmine.junit_reporter.js');
      Array.prototype.push.apply(sources, sourceFiles);
      executeTestSuite('todo', sources, callback);
    }
  };
};

var buildSystem = function () {
  var sourceFiles = ['Jakefile'];
  collectSourceFilesInDir(sourceFiles, 'src/build');

  return {
    codeAnalysis:codeAnalyzer(sourceFiles, {
      bitwise:true, eqeqeq:true, forin:true, immed:true, strict:false,
      latedef:true, nonew:true, noarg:true, undef:true,
      trailing:true, laxcomma:true, validthis:true,

      newcap:true, browser:false, node:true, jquery:false,
      predef:['complete', 'desc', 'task', 'file', 'directory', 'jake']
    })
  };
};

var koViewModels = function () {
  var sourceFiles = [
    'src/main/knockout/viewmodels.js',
    'src/main/knockout/main.js'
  ];

  return {
    codeAnalysis:codeAnalyzer(sourceFiles, {
      bitwise:true, eqeqeq:true, forin:true, immed:true, strict:false,
      latedef:true, nonew:true, noarg:true, undef:true,
      trailing:true, laxcomma:true, validthis:true,

      newcap:true, browser:true, node:false, jquery:false,
      predef:['todo', 'ko']
    }),
    sources:function() {
      return sourceFiles.slice(0);
    }
  };
};

var project = {
  coreLogic:coreLogic(),
  zeptoJQuery:{
    viewModels:zeptoJQueryViewModels(),
    apiFix:zeptoApiFix(),
    sources:function() {
      var sources = project.coreLogic.sources();
      Array.prototype.push.apply(sources, this.apiFix.sources());
      Array.prototype.push.apply(sources, this.viewModels.sources());
      return sources;
    },
    minimize:function(callback) {
      compactFiles(this.sources(), 'js/todo_with_zepto_jquery.min.js', callback);
    }
  },
  ko:{
    viewModels:koViewModels(),
    sources:function() {
      var sources = project.coreLogic.sources();
      Array.prototype.push.apply(sources, this.viewModels.sources());
      return sources;
    },
    minimize:function(callback) {
      compactFiles(this.sources(), 'js/todo_with_ko.min.js', callback);
    }
  },
  unitTestSystem:unitTestSystem(),
  buildSystem:buildSystem(),
  codeAnalysis:function (errorMsgs) {
    console.log('Analyzing code of the application core logic.');
    var coreOk = this.coreLogic.codeAnalysis(errorMsgs);
    console.log('Analyzing code of the Zepto/jQuery view models.');
    var zeptoOk = this.zeptoJQuery.viewModels.codeAnalysis(errorMsgs);
    console.log('Analyzing code of the Zepto API fix.');
    var apiFixOk = this.zeptoJQuery.apiFix.codeAnalysis(errorMsgs);
    console.log('Analyzing code of the Knockout view models.');
    var koOk = this.ko.viewModels.codeAnalysis(errorMsgs);
    console.log('Analyzing code of the unit tests.');
    var testsOk = this.unitTestSystem.codeAnalysis(errorMsgs);
    console.log('Analyzing code of the build system.');
    var buildOk = this.buildSystem.codeAnalysis(errorMsgs);

    return coreOk && zeptoOk && apiFixOk && koOk && testsOk && buildOk;
  },
  executeUnitTests:function (callback) {
    this.unitTestSystem.execute(this.coreLogic, callback);
  }
};


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
  fs.readdirSync('js').forEach(function (fileName) {
    if (fileName.match(/.+\.min\.js$/)) {
      fs.unlinkSync('js/' + fileName);
      console.log('File js/' + fileName + ' has been deleted');
    }
  });
  console.log("Task '" + this.name + "' is completed");
});

desc('Builds only the Knockout based production files of this project. Will not run neither tests nor code analysis.');
file('js/todo_with_ko.min.js', ['js', 'require-minimize'].concat(project.ko.sources()), function () {
  project.ko.minimize(completion(this));
}, {async:true});

desc('Builds only the Zepto/jQuery based production files of this project. Will not run neither tests nor code analysis.');
file('js/todo_with_zepto_jquery.min.js', ['js', 'require-minimize'].concat(project.zeptoJQuery.sources()), function () {
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