"use strict";

function nullLog() {

}

var Event = require('../../lib/core/utils')(nullLog).Event,
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

chai.use(require('sinon-chai'));

describe("An Event", function () {
  var event;

  beforeEach(function () {
    event = new Event();
  });

  describe("given there are registered subscriptors", function () {
    var subscriptor1, subscriptor2, subscriptor3;
    beforeEach(function () {
      subscriptor1 = sinon.stub();
      subscriptor2 = sinon.stub();
      subscriptor3 = sinon.stub();

      event.subscribe(subscriptor1);
      event.subscribe(subscriptor2);
      event.subscribe(subscriptor3);
    });

    it("when publish is called with an object, it notifies all the subscriptors about it", function () {
      var data = "the data to publish";

      event.publish(data);

      expect(subscriptor1).to.have.been.calledWith(data);
      expect(subscriptor2).to.have.been.calledWith(data);
      expect(subscriptor3).to.have.been.calledWith(data);
    });

    it("when publish is called with an object, it notifies all the subscriptors, even if one fails", function () {
      var data = "the data to publish";
      subscriptor2.throws("I'm a broken test subscriptor, don't panic if you see this message on console, ;-) !");

      event.publish(data);

      expect(subscriptor1).to.have.been.calledWith(data);
      expect(subscriptor2).to.have.been.calledWith(data);
      expect(subscriptor3).to.have.been.calledWith(data);
    });

    it("when publish is called with an object, it notifies all the subscriptors only once, even if they are registered several times", function () {
      var data = "the data to publish";
      event.subscribe(subscriptor2);
      event.subscribe(subscriptor2);
      event.subscribe(subscriptor2);
      event.subscribe(subscriptor2);

      event.publish(data);

      expect(subscriptor1).to.have.been.calledExactlyOnce;
      expect(subscriptor2).to.have.been.calledExactlyOnce;
      expect(subscriptor3).to.have.been.calledExactlyOnce;
    });
  });
});
