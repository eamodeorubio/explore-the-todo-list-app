/*
 * The Data Access Layer of the application
 * Currently only a naive InMemoryStorage is implemented
 * It simulates asynchronous data access
 */
var todo = (function (ns, undefined) {
  ns = ns || {};
  ns.store = ns.store || {};

  var newId = function () {
    return 'id' + Math.round(Math.random() * 100000000000000000);
  };
  var marshal = function (obj) {
    return JSON.stringify(obj);
  };
  var unmarshal = function (json) {
    return JSON.parse(json);
  };
  var scheduleCallback = function (callback, param) {
    // Simulate asynchronous processing, perhaps and AJAX request
    setTimeout(function () {
      callback(param);
    }, 500);
  };

  ns.store.InMemoryStorage = function () {
    var objects = []
        , objectsById = {};
    var create = function (dto, callback) {
      dto.id = newId();
      objectsById[dto.id] = objects.length;
      objects.push(marshal(dto));
      scheduleCallback(callback, dto);
    };

    this.all = function (callback) {
      scheduleCallback(callback, objects.map(unmarshal));
    };
    this.save = function (dto, callback) {
      var index = objectsById[dto.id];
      if(!index)
        create(dto, callback);
      else {
        objects[index] = marshal(dto);
        scheduleCallback(callback, dto);
      }
    };
  };

  return ns;
})(todo);