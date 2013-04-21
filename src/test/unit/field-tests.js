"use strict";

function nullLog() {

}

var newField = require('../../lib/core/utils')(nullLog).field,
    test = require('./test-doubles'),
    chai = require('chai'),
    expect = chai.expect;

chai.use(require('sinon-chai'));

describe("A field, initialized with an initial value and a change event", function () {
  var aField, initialValue, event;
  beforeEach(function () {
    initialValue = "field's initial value";
    event = test.doubleFor('event');

    aField = newField(initialValue, event);
  });
  it("when called without parameters, will return its value", function () {
    expect(aField()).to.be.equal(initialValue);
  });
  describe("when called with a parameter", function () {
    it("will change the value of the field", function () {
      var newValue = "new field's value";

      aField(newValue);

      expect(aField()).to.be.equal(newValue);
    });
    it("will return itself", function () {
      var newValue = "new field's value";

      var result = aField(newValue);

      expect(result).to.be.equal(aField);
    });
    it("will publish the new value", function () {
      var newValue = "new field's value";

      aField(newValue);

      expect(event.publish).to.have.been.calledWith(newValue);
    });
    it("won't publish anything if the new value is the same as the old one", function () {
      var newValue = initialValue + ""; // a copy

      aField(newValue);

      expect(event.publish).not.to.have.been.called;
    });
  });
  describe("has a subscribe method that when called with a callback", function () {
    var result, callback;
    beforeEach(function () {
      result = aField.subscribe(callback);
    });
    it("will subscribe the callback into the event", function () {
      expect(event.subscribe).to.have.been.calledWith(callback);
    });
    it("will return the field itself", function () {
      expect(result).to.be.equal(aField);
    });
  });
});