/*
 * The Data Access Layer of the application
 * Currently only a naive InMemoryStorage is implemented
 * It simulates asynchronous data access
 */
"use strict";

var newId = function () {
  return 'id' + Math.round(Math.random() * 100000000000000000);
};
var marshal = function (obj) {
  return JSON.stringify(obj);
};
var unmarshal = function (json) {
  try {
    if (!json)
      return null;
    return JSON.parse(json);
  } catch (e) {
    throw json + ":" + (typeof json) + ":" + e;
  }
};
var scheduleCallback = function (callback, param) {
  // Simulate asynchronous processing, perhaps and AJAX request
  setTimeout(function () {
    if (param)
      callback(param);
    else
      callback();
  }, 0);
};

var STORE_ID = 'todo.store';

module.exports = {
  MemoryStorage: function () {
    var objects = [],
        objectsById = {};
    var create = function (dto, callback) {
      dto.id = newId();
      objectsById[dto.id] = objects.length;
      objects.push(marshal(dto));
      scheduleCallback(callback, dto);
    };
    this.removeAll = function (callback) {
      scheduleCallback(callback);
    };
    this.all = function (callback) {
      scheduleCallback(callback, objects.map(unmarshal));
    };
    this.save = function (dto, callback) {
      var index = objectsById[dto.id];
      if (typeof index !== 'number')
        create(dto, callback);
      else {
        objects[index] = marshal(dto);
        scheduleCallback(callback, dto);
      }
    };
  },
  LocalStorage: function () {
    // In a real application we should use WebSQL or IndexedDB or AJAX
    var objects = unmarshal(localStorage.getItem(STORE_ID)) || [],
        objectsById = {};
    objects.forEach(function (dto, i) {
      objectsById[unmarshal(dto).id] = i;
    });
    var create = function (dto, callback) {
      dto.id = newId();
      objectsById[dto.id] = objects.length;
      objects.push(marshal(dto));
      localStorage.setItem(STORE_ID, marshal(objects));
      scheduleCallback(callback, dto);
    };
    this.removeAll = function (callback) {
      objects = [];
      localStorage.removeItem(STORE_ID);
      scheduleCallback(callback);
    };
    this.all = function (callback) {
      scheduleCallback(callback, objects.map(unmarshal));
    };
    this.save = function (dto, callback) {
      var index = objectsById[dto.id];
      if (typeof index !== 'number')
        create(dto, callback);
      else {
        objects[index] = marshal(dto);
        localStorage.setItem(STORE_ID, marshal(objects));
        scheduleCallback(callback, dto);
      }
    };
  }
};
