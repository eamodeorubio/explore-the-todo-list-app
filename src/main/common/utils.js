var todo = (function (ns, undefined) {
  ns = ns || {};
  ns.utils = ns.utils || {};

  ns.utils.Event = function () {
    var subscriptors = [];

    this.subscribe = function (subscriptor) {
      if(typeof subscriptor !== 'function')
        return;
      if(subscriptors.indexOf(subscriptor) === -1)
        subscriptors.push(subscriptor);
    };
    this.publish = function (data) {
      var err;
      subscriptors.forEach(function (subscriptor) {
        try {
          subscriptor(data);
        } catch (err) {
          console.log(err.toString(), err.stack);
        }
      });
    };
  };

  ns.utils.field = function (initialValue, optEvent) {
    var value = initialValue;
    var change = optEvent || new ns.utils.Event();
    var fieldAccessor = function (optNewValue) {
      if(typeof optNewValue !== 'undefined') {
        var oldValue = value;
        value = optNewValue;
        if(optNewValue !== oldValue)
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
  };
  return ns;
}(todo));