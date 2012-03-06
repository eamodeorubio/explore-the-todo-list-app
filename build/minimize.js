/*
 * A simple build system for the app.
 * You need nodejs and the uglify.js package installed (https://github.com/mishoo/UglifyJS)
 * Simply call 'node build.js' in the shell from the root directory of the project
 */
var fs = require('fs')
    , uglyjs = require('uglify-js')
    , uglifier = uglyjs.uglify;

var uglifyFile = function (srcPath, writeStream, addSeparator) {
  var contents = fs.readFileSync(srcPath, 'utf8');

  var ast = uglyjs.parser.parse(contents);
  ast = uglifier.ast_mangle(ast);
  ast = uglifier.ast_squeeze(ast);
  var uglified = uglifier.gen_code(ast);
  if(addSeparator)
    writeStream.write(';');
  writeStream.write(uglified);
};

var compactFiles = function (filePathsArray, outputFileSrc) {
  var writeStream = fs.createWriteStream(outputFileSrc, {
    flags:'w',
    encoding:'utf8'
  });
  writeStream.on('open', function () {
    var firstFile = true;
    filePathsArray.forEach(function (filePath) {
      if(writeStream.writable) {
        console.log('Compacting %s into %s', filePath, outputFileSrc);
        uglifyFile(filePath, writeStream, !firstFile);
        firstFile = false;
      }
    });
  });
  writeStream.on('error', function (err) {
    console.error('Could not write file: %s %s', outputFileSrc, err);
    process.exit(1);
  });
};

exports.minimizeFiles = function () {
  compactFiles([
    'src/main/common/utils.js',
    'src/main/common/store.js',
    'src/main/common/model.js',
    'src/main/common/controller.js',
    'src/main/common/widgets.js',
    'src/main/knockout/viewmodels.js',
    'src/main/knockout/main.js'
  ], 'js/todo_with_ko.min.js');

  compactFiles([
    'src/main/zepto_jquery/zepto-api-fix.js',
    'src/main/common/utils.js',
    'src/main/common/store.js',
    'src/main/common/model.js',
    'src/main/common/controller.js',
    'src/main/common/widgets.js',
    'src/main/zepto_jquery/viewmodels.js',
    'src/main/zepto_jquery/main.js'
  ], 'js/todo_with_zepto_jquery.min.js');
}