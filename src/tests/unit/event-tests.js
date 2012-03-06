describe("An Event", function () {
  var event;

  beforeEach(function () {
    event = new todo.utils.Event();
  });

  describe("given there are registered subscriptors", function () {
    var subscriptor1, subscriptor2, subscriptor3;
    beforeEach(function () {
      subscriptor1 = jasmine.createSpy('subscriptor 1');
      subscriptor2 = jasmine.createSpy('subscriptor 2');
      subscriptor3 = jasmine.createSpy('subscriptor 3');

      event.subscribe(subscriptor1);
      event.subscribe(subscriptor2);
      event.subscribe(subscriptor3);
    });

    it("when publish is called with an object, it notifies all the subscriptors about it", function () {
      var data = "the data to publish";

      event.publish(data);

      expect(subscriptor1).toHaveBeenCalledWith(data);
      expect(subscriptor2).toHaveBeenCalledWith(data);
      expect(subscriptor3).toHaveBeenCalledWith(data);
    });

    it("when publish is called with an object, it notifies all the subscriptors, even if one fails", function () {
      var data = "the data to publish";
      subscriptor2.andThrow("I'm a broken test subscriptor, don't panic if you see this message on console, ;-) !");

      event.publish(data);

      expect(subscriptor1).toHaveBeenCalledWith(data);
      expect(subscriptor2).toHaveBeenCalledWith(data);
      expect(subscriptor3).toHaveBeenCalledWith(data);
    });

    it("when publish is called with an object, it notifies all the subscriptors only once, even if they are registered several times", function () {
      var data = "the data to publish";
      event.subscribe(subscriptor2);
      event.subscribe(subscriptor2);
      event.subscribe(subscriptor2);
      event.subscribe(subscriptor2);

      event.publish(data);

      expect(subscriptor1).toHaveBeenCalledExactlyOnce();
      expect(subscriptor2).toHaveBeenCalledExactlyOnce();
      expect(subscriptor3).toHaveBeenCalledExactlyOnce();
    });
  });
});
