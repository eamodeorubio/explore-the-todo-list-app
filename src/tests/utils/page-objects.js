var test = (function (ns, browser) {
  ns = ns || {};

  function fixPhantom15EvaluateMethodToAddParameterPassing(webPage) {
    if (phantom.version.major <= 1 && phantom.version.minor <= 5) {
      //var oldEvaluate = webPage.evaluate;
      webPage.executeCommand = function (func, args) {
        // Thanks god the code is open source. Adapted from: https://github.com/ariya/phantomjs/commit/81794f9096
        var str, arg, i, l;
        if (!(func instanceof Function || typeof func === 'string' || func instanceof String)) {
          throw "Wrong use of WebPage#evaluate";
        }
        str = 'function() { return (' + func.toString() + ')(';
        for (i = 1, l = arguments.length; i < l; i++) {
          arg = arguments[i];
          if (/object|string/.test(typeof arg) && !(arg instanceof RegExp)) {
            str += 'JSON.parse(' + JSON.stringify(JSON.stringify(arg)) + '),';
          } else {
            str += arg + ',';
          }
        }
        str = str.replace(/,$/, '') + '); }';
        return webPage.evaluate(str);
      };
    } else
      webPage.executeCommand = webPage.evaluate;
    return webPage;
  }

  function MainPage(webPage) {
    var self = this, pendingCallbacks = {};

    webPage = fixPhantom15EvaluateMethodToAddParameterPassing(webPage);

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
      });
    };

    webPage.onConsoleMessage = function (msg) {
      var callbacksignal = '####[oncallback]####', params;
      if (msg.indexOf(callbacksignal) === 0) {
        // Fixing that phantom 1.5 does not have onCallback
        params = JSON.parse(msg.substring(callbacksignal.length));
        webPage.onCallback.apply(this, params);
      } else
        console.log(msg);
    };

    webPage.onInitialized = function () {
      webPage.executeCommand(function () {
        if (typeof window.callPhantom !== 'function') {
          window.callPhantom = function () {
            // Fixing that phantom 1.5 does not have onCallback
            console.log('####[oncallback]####' + JSON.stringify(Array.prototype.slice.call(arguments)));
          };
        }
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
            // Use jQuery instead of Zepto for DOM manipulation during tests
            // There are problems about checking/unchecking the checkboxes
            if (webPage.injectJs('js/libs/jquery-1.7.1.min.js'))
              callback(null, self);
            else
              callback('Could not load jQuery (needed for testing)');
          }
        }
      });
    };

    this.emptyTheTaskList = function (callback) {
      webPage.executeCommand(function (returnToPhantom) {
        testStorage.removeAll(returnToPhantom);
      }, returnFromSandboxAndInvokeTheCallback(callback));
    };

    this.setupTheTaskList = function (initialTasks, callback) {
      webPage.executeCommand(function (initialTasks, returnToPhantom) {
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
      webPage.executeCommand(function (returnToPhantom) {
        window.startApp(returnToPhantom);
      }, returnFromSandboxAndInvokeTheCallback(callback));
    };

    this.displayedTasks = function () {
      var json = webPage.executeCommand(function () {
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

    this.requestToggleTaskUsingCheck = function (taskIndex) {
      webPage.executeCommand(function (taskIndex) {
        var chk = $('.task-list > .task').eq(taskIndex).find('.chk');
        if ('ko' in window) {
          // knockout needs to change the checked property before the click in order to notice the event
          chk.prop('checked', !chk.prop('checked'));
        }
        chk.trigger('click');
      }, taskIndex);
    };

    this.requestToggleTaskNotUsingCheck = function (taskIndex) {
      webPage.executeCommand(function (taskIndex) {
        $('.task-list > .task').eq(taskIndex).find('.txt').trigger('click');
      }, taskIndex);
    };

    this.fillNewTaskDescription = function (text) {
      webPage.executeCommand(function (text) {
        $(".add-task-widget > .txt").val(text).trigger('keyup').trigger('change');
      }, text);
    };

    this.requestNewTaskUsingKeyboard = function () {
      webPage.executeCommand(function () {
        var e = $.Event("keyup", {which:13, keyCode:13});
        $(".add-task-widget > .txt").focus().trigger(e);
      });
    };

    this.requestNewTaskWithoutKeyboard = function () {
      webPage.executeCommand(function () {
        $(".add-task-widget > .btn").focus().trigger('click');
      });
    };

    this.hasBeenDefined = function (symbol) {
      return webPage.executeCommand(function (symbol) {
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