define(['root'], function(Root) {
  var Element = Root.extend({
    initialize: function() {
      Root.prototype.initialize.call(this);
    }
  });
  return Element;
});