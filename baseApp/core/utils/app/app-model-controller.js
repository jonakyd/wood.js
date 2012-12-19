define(['require'], function(require) {
  var _models = {}
     ,_viewModels = {};

  function initModels(modelList) {
    var loadedModel = 0;

    _.each(modelList, function(modelName) {
      var modelPath = 'models/' + modelName;
      // store module class definition
      require([modelPath], function(modelClass) {
        loadedModel++;
        _models[modelName] = new modelClass();
        if (loadedModel == modelList.length) {
          console.log('model init');
          $(document).trigger('modelready');
        }
      });
    });
  }

  function initViewModels(source) {
    _.each(source, function(viewModel, viewName) {
      _viewModels[viewName] = viewModel;
    });
  }

  function parseViewModel(viewModel) {
    if (viewModel) {
      return (function(mod) {
        mod.getChildren = function(name) {
          var children = mod['_children']; 
          if (name) {
            if (children) return children[name];
            else throw new Error('viewModel dousn\'t have children name ' + name);
          } else {
            return children;
          }
        };
        mod.getContent = function() {
          return mod._content;
        };
        return mod;
      })(viewModel)
    } else throw new Error('viewModel dousn\'t exist');
  }

  return {
    init: function(modelList, source) {
      window.setTimeout(initModels(modelList), 0);
      window.setTimeout(initViewModels(source), 0);
    },
    parse: function(model) {
      return parseViewModel(model);
    },
    getModel: function(modelName) {
      return _models[modelName];
    },
    getViewModel: function(viewModelName) {
      return parseViewModel(_viewModels[viewModelName]);
    }
  }
})