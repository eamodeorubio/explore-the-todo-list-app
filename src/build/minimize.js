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

module.exports = function (filePathsArray, outputFileSrc, callback) {
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
    callback();
  });
  writeStream.on('error', function (err) {
    console.error('Could not write file: %s %s', outputFileSrc, err);
    callback(err);
  });
};