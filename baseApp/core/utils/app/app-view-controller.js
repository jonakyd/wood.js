define(['require', 'utils/app/app-utility'], function(require, Utility) {
  var _views = {};

  function initViews(viewList) {
    var loadedView = 0;

    _.each(viewList, function(viewType) {
      var viewPath = 'modules/' + viewType + '/' + viewType,
        viewCSSPath = Utility.getResource('app/views/modules/' + viewType + '/' + viewType + '.css');

      // store module class definition
      require([viewPath], function(viewClass) {
        loadedView++;
        _views[viewType] = viewClass;
        if (loadedView == viewList.length) {
          console.log('view init');
          $(document).trigger('viewready');
        }
      });
      // append module css
      appendStyleSheet(viewCSSPath);
    });
  }

  function appendStyleSheet(url) {
    $('head').append($('<link>').attr({
      href: url,
      type: 'text/css',
      rel: 'stylesheet'
    }));
  }

  return {
    init: function(viewList) {
      window.setTimeout(initViews(viewList), 0);
    },
    getView: function(type) {
      return new _views[type]();
    }
  }
});