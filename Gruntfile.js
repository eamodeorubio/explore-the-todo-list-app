"use strict";

module.exports = function (grunt) {
  var GRUNT_FILE = 'Gruntfile.js',
      OUTPUT_DIR = 'dist/',
      SRC_DIR = 'src/',
      SCRIPTS_DIR = SRC_DIR + 'lib/',
      TESTS_DIR = SRC_DIR + 'test/',
      CORE_SOURCES = SCRIPTS_DIR + 'core/**/*.js',
      KO_SOURCES = SCRIPTS_DIR + 'knockout/**/*.js',
      ZEPTO_JQUERY_SOURCES = SCRIPTS_DIR + '/zepto_jquery/**/*.js',
      UNIT_TESTS_SOURCES = TESTS_DIR + 'unit/**/*.js',
      STYLES_SOURCES = SRC_DIR + 'css/**/*.css',
      BDD_SOURCES = TESTS_DIR + 'bdd/**/*.js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        browser: false,
        node: false,
        jquery: false,
        bitwise: true,
        camelcase: true,
        curly: false,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        nonew: true,
        plusplus: false,
        undef: true,
        unused: true,
        white: false,
        strict: true,
        globalstrict: true, // The files will be wrapped in a IIFE
        trailing: true,
        maxparams: 3,
        maxdepth: 2,
        maxstatements: 10,
        maxcomplexity: 5
      },
      core: {
        options: {
          globals: {
            module: true,
            setTimeout: true,
            localStorage: true
          }
        },
        files: {
          src: [CORE_SOURCES]
        }
      },
      gruntfile: {
        options: {
          node: true,
          maxstatements: false
        },
        files: {
          src: [GRUNT_FILE]
        }
      },
      knockout: {
        options: {
          browser: true,
          globals: {
            console: true,
            module: true,
            require: true
          }
        },
        files: {
          src: [KO_SOURCES]
        }
      },
      jquery: {
        options: {
          browser: true,
          jquery: true,
          globals: {
            console: true,
            module: true,
            require: true
          }
        },
        files: {
          src: [ZEPTO_JQUERY_SOURCES]
        }
      },
      bdd: {
        options: {
          node: true,
          validthis: true
        },
        files: {
          src: [BDD_SOURCES]
        }
      },
      tests: {
        options: {
          node: true,
          expr: true,
          latedef: false, // Sic! Not working with function declarations
          globals: {
            describe: true,
            beforeEach: true,
            afterEach: true,
            xdescribe: true,
            context: true,
            it: true,
            xit: true
          }
        },
        files: {
          src: [UNIT_TESTS_SOURCES]
        }
      }
    },
    csslint: {
      options: {
        formatters: [
          {id: 'junit-xml', dest: 'csslint_junit.xml'}
        ]
      },
      main: {
        src: [STYLES_SOURCES]
      }
    },
    simplemocha: {
      options: {
        timeout: 500, // They are *unit* tests!
        ui: 'bdd'
      },
      dev: {
        options: {
          reporter: 'dot'
        },
        files: {
          src: [UNIT_TESTS_SOURCES]
        }
      },
      ci: {
        options: {
          reporter: 'mocha-specxunitcov-reporter'
        },
        files: {
          src: [UNIT_TESTS_SOURCES]
        }
      }
    },
    watch: {
      gruntfile: {
        files: [GRUNT_FILE],
        tasks: ['jshint:gruntfile']
      },
      bdd: {
        files: [BDD_SOURCES],
        tasks: ['jshint:bdd']
      },
      tests: {
        files: [UNIT_TESTS_SOURCES],
        tasks: ['jshint:tests', 'simplemocha:dev']
      },
      core: {
        files: [CORE_SOURCES],
        tasks: ['jshint:core', 'simplemocha:dev']
      },
      zeptoJQuery: {
        files: [ZEPTO_JQUERY_SOURCES],
        tasks: ['jshint:jquery', 'simplemocha:dev']
      },
      knockout: {
        files: [KO_SOURCES],
        tasks: ['jshint:ko', 'simplemocha:dev']
      },
      styles: {
        files: [STYLES_SOURCES],
        tasks: ['csslint']
      }
    },
    clean: [OUTPUT_DIR],
    copy: {
      main: {
        files: [
          {expand: true, cwd: SRC_DIR, src: ['img/**', '**/!(initial_*).html'], dest: OUTPUT_DIR},
          {expand: true, cwd: './', src: ['vendor/**/!(almond.js)'], dest: OUTPUT_DIR + 'js/'}
        ]
      }
    },
    cssmin: {
      options: {
        report: 'gzip'
      },
      minify: {
        src: [STYLES_SOURCES],
        dest: "dist/css/<%= pkg.name %>.min.css"
      }
    },
    requirejs: {
      options: {
        baseUrl: SCRIPTS_DIR,
        cjsTranslate: true,
        useStrict: true,
        preserveLicenseComments: false,
        generateSourceMaps: true,
        optimize: 'uglify2',
        include: ['../../vendor/almond.js']
      },
      zeptoJQuery: {
        options: {
          name: 'zepto_jquery/main',
          insertRequire: ['zepto_jquery/main'],
          out: "dist/js/<%= pkg.name %>-zepto_jquery.min.js",
          uglify2: {
            report: 'gzip',
            mangle: {
              except: ['jQuery', 'Zepto']
            }
          }
        }
      },
      ko: {
        options: {
          name: 'knockout/main',
          insertRequire: ['knockout/main'],
          out: "dist/js/<%= pkg.name %>-ko.min.js",
          uglify2: {
            report: 'gzip',
            mangle: {
              except: ['ko']
            }
          }
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8088,
          base: OUTPUT_DIR
        }
      }
    },
    cucumberjs: {
      files: 'src/test/bdd/features/',
      options: {
        format: 'pretty',
        steps: 'src/test/bdd/step_defs/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-cucumber');

  grunt.registerTask('lint', [
    'csslint',
    'jshint'
  ]);

  grunt.registerTask('dev', [
    'lint',
    'simplemocha:dev'
  ]);

  grunt.registerTask('dist', [
    'clean',
    'cssmin',
    'requirejs',
    'copy'
  ]);

  grunt.registerTask('build', [
    'lint',
    'simplemocha:ci',
    'dist',
    'connect:server',
    'cucumberjs'
  ]);

  grunt.registerTask('default', ['watch']);
};