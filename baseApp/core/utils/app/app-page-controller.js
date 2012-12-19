define([
  'require',
  'utils/app/app-model-controller',
  'utils/app/app-view-controller',
  'utils/app/app-transition'
], function(require, ModelController, ViewController, Transition) {
  /* 
   *  @namespace App.Page
   *  @desc contain whole app's page storage and manipulate method
   */

  var _pages = {}
     ,_currentPage = '';

  function initPages(viewList) {
    console.log('page init');
    _.each(viewList, function(viewType) {
      // trigger > initialize
      _pages[viewType] = new ViewController.getView(viewType);
      // trigger > load (beforerender, render, afterrender)
      _pages[viewType].$el.trigger('load');
    });
    $(document).trigger('pageready');
  }

  return {
    init: function(viewList) {
      var initEvents = ['viewready', 'modelready']
         ,initFlag = 0;
      $(document).one(initEvents.join(' '), function(e) {
        initFlag++;
        if (initFlag == initEvents.length) initPages(viewList);
      });
    },
    getPage: function(pageName) {
      if (_pages[pageName]) return _pages[pageName];
      else throw new Error('no page ' + pageName + ' found');
    },
    setCurrentPageName: function(pageName) {
      if (_pages[pageName]) _currentPageName = pageName;
      else return false;
    },
    getCurrentPageName: function() {
      return _currentPageName;
    },
    getCurrentPage: function() {
      if (_pages[_currentPageName]) return _pages[_currentPageName];
      else throw new Error('no currentPage found');
    },
    showPage: function(fromPage, toPage, isBack) {
      if (!App.getBusy()) {
        /*  
         *  trigger transition event
         */
        var toPageEventData = {
              isBack: isBack,
              fromPage: fromPage
            }
           ,fromPageEventData = {
              isBack: isBack,
              toPage: toPage
            }
           ,onSuccess = function(e) {
              toPage.$el.off('webkitTransitionEnd');
              /* after transition */
              App.setBusy(false);
              if (fromPage.$el) fromPage.$el.trigger('aftertransition', fromPageEventData);
              if (toPage.$el) toPage.$el.trigger('aftertransition', toPageEventData);
              if (fromPage.setSelected) fromPage.setSelected('false');
            };

        /* before transition */
        App.setBusy(true);
        if (fromPage.$el) fromPage.$el.trigger('beforetransition', fromPageEventData);
        if (toPage.$el) toPage.$el.trigger('beforetransition', toPageEventData);
        if (toPage.setSelected) toPage.setSelected('true');

        /*  
         *  determine transition method 
         */
        var transitionMethod = isBack ? fromPage.$el.data('transition') : toPage.$el.data('transition')
           ,transitionAnimateCapability = App.Utility.checkAnimationCapability() 
           ,transitionFunction
           ,transitionDirection;

        switch (transitionMethod) {
          case 'pop':
            transitionDirection = isBack ? 'back' : 'front';
            transitionFunction = Transition.pop;
            break;
          case 'slideV':
            transitionDirection = isBack ? 'up' : 'down';
            transitionFunction = Transition.slide;
            break;
          default:
            // default slideH
            transitionDirection = isBack ? 'left' : 'right';
            transitionFunction = Transition.slide;
            break;
        }

        transitionFunction(transitionDirection, transitionAnimateCapability, onSuccess, null,  fromPage, toPage);
      } else {
        console.warn('app is in Animation');
      }
    }
  };
})