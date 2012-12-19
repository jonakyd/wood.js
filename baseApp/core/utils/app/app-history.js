define(['backbone'], function() {

  var _history = [];

  /*  
   *  Initialize history 
   */
  Backbone.history.start({pushState: true})

  return {
    push: function(state) {
      return _history.push(state);
    },
    prev: function(state) {
      _history.pop(state);
      return _history[_history.length - 1];
    },
    replace: function(state) {
      return _history[_history.length - 1] = state;
    }
  }
})