var test = (function (ns, browser) {
  ns = ns || {};

  function MainPage(webPage) {
    this.emptyTheTaskList = function (callback) {
      webPage.onCallback = function (arrayOfArgs) {
        webPage.onCallback = null;
        callback.apply(this, arrayOfArgs);
      };
      webPage.evaluateAsync(function () {
        storage.removeAll(function () {
          if (arguments.length === 0)
            callPhantom.call(this);
          else
            callPhantom.call(this, Array.prototype.slice.call(arguments));
        });
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
    }
  }

  ns.mainPage = function (callback) {
    var webPage = browser.create();
    webPage.onError = function (msg, trace) {
      console.log(msg);
      trace.forEach(function (item) {
        console.log('  ', item.file, ':', item.line);
      })
    };
    webPage.onConsoleMessage = function (msg) {
      console.log(msg);
    };

    webPage.open(ns.mainPageURL, function (status) {
      if (status === 'fail')
        callback(status);
      else {
        var mainPage = new MainPage(webPage);
        if (mainPage.hasBeenDefined('$'))
          callback(null, mainPage);
        else {
          console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
          webPage.includeJs('js/libs/zepto-0.8/dist/zepto.min.js', function () {
            if (mainPage.hasBeenDefined('$'))
              callback('Could not load Zepto (needed for testing)');
            else
              callback(null, new MainPage(webPage));
          });
        }
      }
    });
  };

  return ns;
}(test, require('webpage')));