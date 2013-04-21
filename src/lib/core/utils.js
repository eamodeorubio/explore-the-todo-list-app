"use strict";

// TODO: fixme -- do this properly using YepNope or similar
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function")
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        FNOP = function () {
        },
        FBound = function () {
          return fToBind.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    FNOP.prototype = this.prototype;
    FBound.prototype = new FNOP();

    return FBound;
  };
}

module.exports = function (log) {
  function Event() {
    var subscriptors = [];

    this.subscribe = function (subscriptor) {
      if (typeof subscriptor !== 'function')
        return;
      if (subscriptors.indexOf(subscriptor) === -1)
        subscriptors.push(subscriptor);
    };
    this.publish = function (data) {
      subscriptors.forEach(function (subscriptor) {
        try {
          subscriptor(data);
        } catch (err) {
          log(err.toString(), err.stack);
        }
      });
    };
  }

  return {
    Event: Event,
    field: function (initialValue, optEvent) {
      var value = initialValue;
      var change = optEvent || new Event();
      var fieldAccessor = function (optNewValue) {
        if (typeof optNewValue !== 'undefined') {
          var oldValue = value;
          value = optNewValue;
          if (optNewValue !== oldValue)
            change.publish(value);
          return fieldAccessor;
        }
        return value;
      };
      fieldAccessor.subscribe = function (subscriptor) {
        change.subscribe(subscriptor);
        return fieldAccessor;
      };
      return fieldAccessor;
    }
  };
};
