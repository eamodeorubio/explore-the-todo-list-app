var compactFiles, analyze
    , executeTestSuite = require('./runtests')
    , exec = require('child_process').exec
    , fs = require('fs');

function makeSureModuleIsInstalled(module, callback) {
  function installModule() {
    var cmd = 'npm install ' + module;
    console.log("Installing locally the module " + module);
    console.log(cmd);
    var child = exec(cmd, function (err) {
      callback(err);
    });
    child.stdout.on('data', console.log.bind(console));
    child.stderr.on('data', console.error.bind(console));
  }

  try {
    if (fs.statSync('node_modules/' + module).isDirectory())
      callback();
    else
      installModule();
  } catch (err) {
    installModule();
  }
}

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

var zeptoApiFix = (function () {
  var sourceFiles = ['src/main/zepto_jquery/zepto-api-fix.js'];

  return {
    codeAnalysis:codeAnalyzer(sourceFiles, {
      bitwise:true, eqeqeq:true, forin:true, immed:true, strict:false,
      latedef:true, nonew:true, noarg:true, undef:true,
      trailing:true, laxcomma:true, validthis:true,

      newcap:false, browser:true, node:false, jquery:true,
      predef:['Zepto']
    }),
    sources:function () {
      return sourceFiles.slice(0);
    }
  };
}());

var unitTestSystem = (function () {
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
      predef:['complete', 'desc', 'task', 'file', 'directory', 'jake']
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

function minimize(srcFiles, outputFile, callback) {
  makeSureModuleIsInstalled('uglify-js', function (err) {
    if (err)
      console.log('Error installing uglify-js: %s', err);
    if (!compactFiles)
      compactFiles = require('./minimize');
    compactFiles(srcFiles, outputFile, callback);
  });
}

module.exports = {
  coreLogic:coreLogic,
  zeptoJQuery:{
    viewModels:zeptoJQueryViewModels,
    apiFix:zeptoApiFix,
    sources:function () {
      var sources = coreLogic.sources();
      Array.prototype.push.apply(sources, this.apiFix.sources());
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
  buildSystem:buildSystem,
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
  },
  clean:function () {
    fs.readdirSync('js').forEach(function (fileName) {
      if (fileName.match(/.+\.min\.js$/)) {
        fs.unlinkSync('js/' + fileName);
        console.log('File js/' + fileName + ' has been deleted');
      }
    });
  },
  makeSureJsHintIsInstalled:function (callback) {
    makeSureModuleIsInstalled('jshint', function (err) {
      if (err)
        console.log('Error installing jshint: %s', err);
      analyze = require('./analyze');
      callback();
    });
  }
};