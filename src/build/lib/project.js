var compactFiles, analyze
    , executeTestSuite = require('./runtests')
    , spawn = require('child_process').spawn
    , minimize = require('./minimize')
    , analyze = require('./analyze')
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

function codeAnalyzer(sourceFiles, jsHintConfig) {
  return function (errorMsgs) {
    var result = analyze(sourceFiles, jsHintConfig);
    if (errorMsgs)
      Array.prototype.push.apply(errorMsgs, result.errorMsgs);
    return result.passed;
  };
}

var coreLogic = (function () {
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
}());

var zeptoJQueryViewModels = (function () {
  // Must be this order to minimize successfuly
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
    sources:function () {
      return sourceFiles.slice(0);
    }
  };
}());

var unitTestSystem = (function () {
  var sourceFiles = ['src/tests/utils/test-doubles.js', 'src/tests/utils/custom-matchers.js', 'src/tests/utils/custom-reporter.js'];
  collectSourceFilesInDir(sourceFiles, 'src/tests/unit');

  return {
    codeAnalysis:codeAnalyzer(sourceFiles, {
      bitwise:true, eqeqeq:true, forin:true, immed:true, strict:false,
      latedef:true, nonew:true, noarg:true, undef:true,
      trailing:true, laxcomma:true, validthis:true,

      newcap:true, browser:false, node:false, jquery:false,
      predef:['todo', 'test', 'jasmine', 'afterEach', 'beforeEach', 'expect', 'console', 'module',
        'describe', 'it', 'xdescribe', 'xit', 'waits', 'waitsFor', 'runs', 'spyOn']
    }),
    execute:function (moduleToTest, callback) {
      var sources = moduleToTest.sources();
      sources.push('src/tests/libs/larrymyers-jasmine-reporters/src/jasmine.junit_reporter.js');
      Array.prototype.push.apply(sources, sourceFiles);
      executeTestSuite('todo', sources, callback);
    }
  };
}());

var bddSystem = (function () {
  var sourceFiles = ['src/tests/utils/page-objects.js', 'src/tests/utils/custom-reporter.js'];
  collectSourceFilesInDir(sourceFiles, 'src/tests/bdd');

  return {
    codeAnalysis:codeAnalyzer(sourceFiles, {
      bitwise:true, eqeqeq:true, forin:true, immed:true, strict:false,
      latedef:true, nonew:true, noarg:true, undef:true,
      trailing:true, laxcomma:true, validthis:true, evil:true,

      newcap:true, browser:true, node:true, jquery:true,
      predef:['todo', 'test', 'jasmine', 'afterEach', 'beforeEach', 'expect',
        'phantom', '__phantom_writeFile', 'describe', 'it', 'testStorage', 'CustomReporterWithCallback',
        'xdescribe', 'xit', 'waits', 'waitsFor', 'runs', 'spyOn']
    }),
    execute:function (url, callback) {
      console.log("Starting BDD Test Suite for %s", url);
      var phantomProcess = spawn('phantomjs', ['src/tests/bdd/bdd-suite.js', url], {stdio:'inherit'});
      phantomProcess.on('exit', function (exitCode) {
        callback(exitCode === 0);
      });
    }
  };
}());

var buildSystem = (function () {
  var sourceFiles = ['Jakefile'];
  collectSourceFilesInDir(sourceFiles, 'src/build');

  return {
    codeAnalysis:codeAnalyzer(sourceFiles, {
      bitwise:true, eqeqeq:true, forin:true, immed:true, strict:false,
      latedef:true, nonew:true, noarg:true, undef:true,
      trailing:true, laxcomma:true, validthis:true,

      newcap:true, browser:false, node:true, jquery:false,
      predef:['complete', 'desc', 'task', 'file', 'directory', 'jake', 'fail']
    })
  };
}());

var koViewModels = (function () {
  // Must be this order to minimize successfuly
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
    sources:function () {
      return sourceFiles.slice(0);
    }
  };
}());

module.exports = {
  coreLogic:coreLogic,
  zeptoJQuery:{
    viewModels:zeptoJQueryViewModels,
    sources:function () {
      var sources = coreLogic.sources();
      Array.prototype.push.apply(sources, this.viewModels.sources());
      return sources;
    },
    minimize:function (callback) {
      minimize(this.sources(), 'js/todo_with_zepto_jquery.min.js', callback);
    }
  },
  ko:{
    viewModels:koViewModels,
    sources:function () {
      var sources = coreLogic.sources();
      Array.prototype.push.apply(sources, this.viewModels.sources());
      return sources;
    },
    minimize:function (callback) {
      minimize(this.sources(), 'js/todo_with_ko.min.js', callback);
    }
  },
  unitTestSystem:unitTestSystem,
  bddSystem:bddSystem,
  buildSystem:buildSystem,
  codeAnalysis:function (errorMsgs) {
    console.log('Analyzing code of the application core logic.');
    var coreOk = this.coreLogic.codeAnalysis(errorMsgs);
    console.log('Analyzing code of the Zepto/jQuery view models.');
    var zeptoOk = this.zeptoJQuery.viewModels.codeAnalysis(errorMsgs);
    console.log('Analyzing code of the Zepto API fix.');
    var koOk = this.ko.viewModels.codeAnalysis(errorMsgs);
    console.log('Analyzing code of the unit tests.');
    var testsOk = this.unitTestSystem.codeAnalysis(errorMsgs);
    console.log('Analyzing code of the build system.');
    var buildOk = this.buildSystem.codeAnalysis(errorMsgs);
    console.log('Analyzing code of the BDD system.');
    var bddOk = this.bddSystem.codeAnalysis(errorMsgs);

    return coreOk && zeptoOk && koOk && testsOk && buildOk && bddOk;
  },
  executeUnitTests:function (callback) {
    this.unitTestSystem.execute(this.coreLogic, callback);
  },
  executeBDDTests:function (callback) {
    var self = this;
    self.bddSystem.execute('todo_with_knockout.html', function (okKnockout) {
      console.log('BDD Tests for knockout %s', okKnockout ? 'SUCCESS' : 'FAIL');
      self.bddSystem.execute('todo_with_zepto_jquery.html', function (okZeptoJQuery) {
        console.log('BDD Tests for Zepto/jQuery %s', okZeptoJQuery ? 'SUCCESS' : 'FAIL');
        callback(okKnockout && okZeptoJQuery);
      });
    });
  },
  clean:function () {
    fs.readdirSync('js').forEach(function (fileName) {
      if (fileName.match(/.+\.min\.js$/)) {
        fs.unlinkSync('js/' + fileName);
        console.log('File js/' + fileName + ' has been deleted');
      }
    });
  }
};