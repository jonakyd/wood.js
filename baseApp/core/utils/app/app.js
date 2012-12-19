define([
  'require',
  //plist
  'config', 'models/source', 'models/user',
  //core app function
  'utils/app/app-history','utils/app/app-transition', 'utils/app/app-touch', 'utils/app/app-orientation', 'utils/app/app-utility',
  //app module
  'utils/app/app-model-controller',
  'utils/app/app-view-controller',
  'utils/app/app-page-controller'
],function(require) {
  var Transition = require('utils/app/app-transition')
     ,Touch = require('utils/app/app-touch')
     ,Orientation = require('utils/app/app-orientation')
     ,Utility = require('utils/app/app-utility')
     ,AppHistory = require('utils/app/app-history')
     ,ModelController = require('utils/app/app-model-controller')
     ,ViewController = require('utils/app/app-view-controller')
     ,PageController = require('utils/app/app-page-controller')
     ,User = require('models/user')
     ,Source = require('models/source')
     ,Config = require('config');

  var App = window.App = (function() {
    var _busy = false;
    return {
      setBusy: function(status) {
        _busy = status;
      },
      getBusy: function(status) {
        return _busy;
      },
      init: function() {
        /*
         *  PageController.init will bind event on document object,
         *  so we have to bind before ViewController.init and ModelController.init 
         */
        PageController.init(Config.views);
        ViewController.init(Config.views);
        ModelController.init(Config.models, Source);
        // @TODO supported orientation argument
        Orientation.init();
      },
      start: function(initPageName, $splashDiv) {
        // Init First Module
        AppHistory.push(initPageName);
        Router.navigate(initPageName);

        // transition start
        PageController.showPage($splashDiv.get(0), App.Page.getPage(initPageName), false);
        // set current page
        PageController.setCurrentPageName(initPageName);
      }
    }
  })();

  App.Orientation = Orientation;
  App.Utility = Utility;
  App.Model = ModelController;
  App.View = ViewController;
  App.Page = PageController;
  App.Touch = Touch;
  App.History = AppHistory;
  return App;
});