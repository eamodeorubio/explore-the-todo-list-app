//logLevel = LOG_DEBUG;
var BASE_DIR = 'src/test/bdd/';
files = [
  MOCHA,
  MOCHA_ADAPTER,
  {pattern: BASE_DIR + "vendor/jquery-1.9.1.min.js", watched: false, included: true, served: true},
  {pattern: BASE_DIR + "vendor/bililiteRange.js", watched: false, included: true, served: true},
  {pattern: BASE_DIR + "vendor/jquery.simulate.js", watched: false, included: true, served: true},
  {pattern: BASE_DIR + "vendor/jquery.simulate.ext.js", watched: false, included: true, served: true},
  {pattern: BASE_DIR + "vendor/jquery.simulate.key-sequence.js", watched: false, included: true, served: true},
  {pattern: 'node_modules/chai/chai.js', watched: false, included: true, served: true},
  {pattern: BASE_DIR + 'consulting-tasks.js', watched: false, included: true, served: true},
  {pattern: BASE_DIR + 'adding-tasks.js', watched: false, included: true, served: true},
  {pattern: BASE_DIR + 'doing-tasks.js', watched: false, included: true, served: true},
  {pattern: BASE_DIR + 'page-objects.js', watched: false, included: true, served: true},
  {pattern: BASE_DIR + 'main.js', watched: false, included: true, served: true},
  {pattern: 'dist/**', watched: false, included: false, served: true}
];