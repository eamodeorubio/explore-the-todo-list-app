var test = (function (ns, browser) {
  ns = ns || {};

  function MainPage(webPage) {
    var self = this;

    webPage.onError = function (msg, trace) {
      console.log(msg);
      trace.forEach(function (item) {
        console.log('  ', item.file, ':', item.line);
      })
    };

    webPage.onConsoleMessage = function (msg) {
      console.log(msg);
    };

    webPage.onInitialized = function () {
      webPage.evaluate(function () {
        window.underTest = true;
      });
    };

    this.open = function (callback) {
      webPage.open(ns.mainPageURL, function (status) {
        if (status === 'fail')
          callback(status);
        else {
          if (self.hasBeenDefined('$'))
            callback(null, self);
          else {
            webPage.includeJs('js/libs/zepto-0.8/dist/zepto.min.js', function () {
              if (self.hasBeenDefined('$'))
                callback('Could not load Zepto (needed for testing)');
              else
                callback(null, self);
            });
          }
        }
      })
    };

    this.emptyTheTaskList = function (callback) {
      webPage.onCallback = function (arrayOfArgs) {
        callback.apply(this, arrayOfArgs);
      };
      webPage.evaluateAsync(function () {
        testStorage.removeAll(function () {
          if (arguments.length === 0)
            callPhantom.call(this);
          else
            callPhantom.call(this, Array.prototype.slice.call(arguments));
        });
      });
    };

    this.setupTheTaskList = function (initialTasks, callback) {
      webPage.onCallback = function (arrayOfArgs) {
        callback.apply(this, arrayOfArgs);
      };
      webPage.evaluate(function (initialTasks) {
        function returnToPhantom() {
          if (arguments.length === 0)
            callPhantom.call(this);
          else
            callPhantom.call(this, Array.prototype.slice.call(arguments));
        }

        var totalToSave = initialTasks.length, errors = 0;
        initialTasks.forEach(function (task) {
          testStorage.save(task, function (dto) {
            totalToSave--;
            if (!dto)
              errors++;
            if (totalToSave < 1)
              returnToPhantom(errors > 0);
          });
        });
      }, initialTasks);
    };

    this.startApplication = function (callback) {
      webPage.onCallback = function () {
        callback.call(this);
      };
      webPage.evaluate(function () {
        window.startApp();
        setTimeout(function () {
          callPhantom.call(this);
        }, 700);
      });
    };

    this.displayedTasks = function () {
      var json = webPage.evaluate(function () {
        var tasks = [];
        $('.task-list > .task').each(function () {
          var el = $(this), task = {};
          task.text = el.find('.txt').first().text();
          task.done = el.find('.chk').first().prop('checked');
          tasks.push(task);
        });
        return JSON.stringify(tasks);
      });
      return JSON.parse(json);
    };

    this.hasBeenDefined = function (symbol) {
      return webPage.evaluate(function (symbol) {
        return symbol in window;
      }, symbol);
    };

    this.dispose = function () {
      webPage.release();
      webPage = null;
    };
  }

  ns.mainPage = function (callback) {
    var mainPage = new MainPage(browser.create());
    mainPage.open(callback);
  };

  return ns;
}(test, require('webpage')));