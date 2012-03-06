if('Zepto' in window) {
  Zepto.fn.clone = function () {
    var ret = Zepto([]);
    this.each(function () {
      ret.push(this.cloneNode(true));
    });
    return ret;
  };
  Zepto.fn.prop = function (name, value) {
    if(typeof value !== 'undefined') {
      return this.each(function () {
        this[name] = value;
      });
    }
    return this.get(0)[name];
  };
}