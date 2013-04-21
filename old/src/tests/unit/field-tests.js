describe("A field, initialized with an initial value and a change event", function () {
  var field, initialValue, event;
  beforeEach(function () {
    initialValue = "field's initial value";
    event = test.doubleFor('event');

    field = todo.utils.field(initialValue, event);
  });
  it("when called without parameters, will return its value", function () {
    expect(field()).toBe(initialValue);
  });
  describe("when called with a parameter", function () {
    it("will change the value of the field", function () {
      var newValue = "new field's value";

      field(newValue);

      expect(field()).toBe(newValue);
    });
    it("will return itself", function () {
      var newValue = "new field's value";

      var result = field(newValue);

      expect(result).toBe(field);
    });
    it("will publish the new value", function () {
      var newValue = "new field's value";

      field(newValue);

      expect(event.publish).toHaveBeenCalledWith(newValue);
    });
    it("won't publish anything if the new value is the same as the old one", function () {
      var newValue = initialValue + ""; // a copy

      field(newValue);

      expect(event.publish).not.toHaveBeenCalled();
    });
  });
  describe("has a subscribe method that when called with a callback", function () {
    var result, callback;
    beforeEach(function () {
      result = field.subscribe(callback);
    });
    it("will subscribe the callback into the event", function () {
      expect(event.subscribe).toHaveBeenCalledWith(callback);
    });
    it("will return the field itself", function () {
      expect(result).toBe(field);
    });
  });
});