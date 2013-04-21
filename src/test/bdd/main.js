["knockout", "zepto", "jquery"].forEach(function (tech) {
  var expect = chai.expect;

  function newUI() {
    return new bdd.UI(tech, $);
  }

  bdd.consultingTasks(newUI, expect);
  bdd.addingTasks(newUI, expect);
  bdd.doingTasks(newUI, expect);
});