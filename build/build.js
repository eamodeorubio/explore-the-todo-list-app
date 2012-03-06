/*
 * A simple build system for the app.
 * You need nodejs (http://nodejs.org/#download) and the uglify.js package installed (https://github.com/mishoo/UglifyJS)
 * Simply call 'node build.js' in the shell from the root directory of the project
 */
var test = require('./runtests').executeTests
    , minimize = require('./minimize').minimizeFiles;

if(process.argv.length >= 0 && process.argv.indexOf('--skipTests') != -1) {
  console.log("Skipping tests !");
  minimize();
} else {
  test(function (success) {
    if(success)
      minimize();
    else
      console.log("Tests failed !!");
  });
}