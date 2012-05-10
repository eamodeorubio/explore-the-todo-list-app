var fs = require('fs')
  , util = require('util')
  , jshint = require('jshint').JSHINT;

module.exports = function(filePathsArray, opts) {
  var result={passed: true, errorMsgs:[]};
  filePathsArray.forEach(function(filePath) {
    var contents = fs.readFileSync(filePath, 'utf8');
    var passed=jshint(contents, opts);
    if(!passed) {
      result.passed=false;
      jshint.errors.forEach(function(error) {
        if(error)
          result.errorMsgs.push(util.format("Error at file %s [%d, %d]: %s",
                                    filePath, error.line, error.character, error.reason));
        else
          result.errorMsgs.push("Abort code analysis");
      });
    }
  });
  return result;
};