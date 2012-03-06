beforeEach(function () {
  this.addMatchers({
    'toHaveBeenCalledExactlyOnce':function () {
      var spy = this.actual;
      this.message = function () {
        return "The method '" + jasmine.pp(spy) + "' has not been called exactly once, it was " + spy.callCount
      };
      return spy && spy.callCount == 1;
    }
  })
});