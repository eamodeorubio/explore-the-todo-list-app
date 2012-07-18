var test = (function (ns, browser) {
  ns = ns || {};

  function MainPage(webPage) {
    var self = this, pendingCallbacks = {};

    function randomId() {
      return Math.round(Math.random() * 1e20) + "";
    }

    function returnFromSandboxAndInvokeTheCallback(callback) {
      var callbackId = randomId();
      pendingCallbacks[callbackId] = callback;
      return new Function("callPhantom.call(this, " + callbackId + ", Array.prototype.slice.call(arguments));");
    }

    webPage.onCallback = function (callbackId, arrayOfArgs) {
      var callback = pendingCallbacks[callbackId];
      delete pendingCallbacks[callbackId];
      if (typeof callback === 'function')
        callback.apply(this, arrayOfArgs);
    };

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
      webPage.evaluate(function (returnToPhantom) {
        testStorage.removeAll(returnToPhantom);
      }, returnFromSandboxAndInvokeTheCallback(callback));
    };

    this.setupTheTaskList = function (initialTasks, callback) {
      webPage.evaluate(function (initialTasks, returnToPhantom) {
        var totalToSave = initialTasks.length, errors = 0;
        initialTasks.forEach(function (task) {
          task.description = task.text;
          delete task.text;
          testStorage.save(task, function (dto) {
            totalToSave--;
            if (!dto)
              errors++;
            if (totalToSave < 1)
              returnToPhantom(errors > 0);
          });
        });
      }, initialTasks, returnFromSandboxAndInvokeTheCallback(callback));
    };

    this.startApplication = function (callback) {
      webPage.evaluate(function (returnToPhantom) {
        window.startApp(returnToPhantom);
      }, returnFromSandboxAndInvokeTheCallback(callback));
    };

    this.displayedTasks = function () {
      var json = webPage.evaluate(function () {
        var tasks = [];
        $('.task-list > .task').each(function () {
          var el = $(this), task = {};
          task.text = el.find('.txt').first().text();
          task.done = el.find('.chk').first().prop('checked');
          task.inProgress = el.hasClass('working');
          tasks.push(task);
        });
        return JSON.stringify(tasks);
      });
      return JSON.parse(json);
    };

    this.fillNewTaskDescription = function (text) {
      webPage.evaluate(function (text) {
        $(".add-task-widget > .txt").val(text);
      }, text);
    };

    this.requestNewTaskUsingKeyboard = function (text) {
      webPage.evaluate(function () {
        var e = $.Event("keyup", {which:13, keyCode:13});
        $(".add-task-widget > .txt").focus().trigger(e);
      });
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