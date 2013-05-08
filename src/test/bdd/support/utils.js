"use strict";

module.exports = {
  enterTheApp: function (distro, done) {
    this.UI().visit(distro).then(done, done);
  },
  toIndex: function (n) {
    return Number(n) - 1;
  },
  sync: function (fn) {
    return function () {
      var lastIndex = arguments.length - 1,
          done = arguments[lastIndex];
      try {
        fn.apply(this, Array.prototype.slice.call(arguments, 0, lastIndex));
        done();
      } catch (err) {
        done(err);
      }
    };
  }
};