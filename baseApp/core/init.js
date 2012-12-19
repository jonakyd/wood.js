requirejs.config({
  baseUrl: '.',
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'backbone.localstorage': ['backbone'],
    'jquery.qrcode': ['jquery', 'qrcode'],
    myApp: ['utils/device']
  },
  paths: {
    init: 'core/init',
    // require.js plugin 
    text: 'libs/text',
    // Cordova plugin
    cordovaFacebookConnect: 'libs/cordova/plugin-fb-connect',
    cordovaGoogleAnalystics: 'libs/cordova/plugin-google-analytics',
    cordovaEmailComposer: 'libs/cordova/plugin-email-composer',
    cordovaWebIntent: 'libs/cordova/plugin-web-intent',
    // third-party javascript library
    facebookSDK: 'libs/facebook_js_sdk',
    jquery: 'libs/jquery-1.7.2',
    underscore: 'libs/underscore',
    backbone: 'libs/backbone092f',
    'backbone.localstorage': 'libs/backbone.localStorage',
    'jquery.qrcode': 'libs/jquery.qrcode',
    iscroll: 'libs/iscroll419',
    mustache: 'libs/mustache',
    qrcode: 'libs/qrcode',
    // core utils
    utils: 'core/utils',
    myApp: 'core/utils/app/app',
    abstractmodel: 'core/models/model',
    // core page class
    root: 'core/views/root/root',
    abstractpage: 'core/views/root/abstractPage/abstractPage',
    main: 'core/views/root/abstractPage/main/main',
    sub: 'core/views/root/abstractPage/sub/sub',
    // core element class 
    element: 'core/views/root/element/element',
    carousel: 'core/views/root/element/carousel/carousel',
    navigationbar: 'core/views/root/element/navigationbar/navigationbar',
    tabhost: 'core/views/root/element/tabhost/tabhost',
    // custom config list
    config: 'app/config',
    // custom model 
    models: 'app/models',
    // custom view/control 
    router: 'app/router',
    splash: 'app/views/splash',
    modules: 'app/views/modules'
  }
});
requirejs.onError = function(err) {
  console.error(err);
}
require([
  'require',
  // include third-party javascript library
  'backbone', 'iscroll', 'mustache',
  // include Cordova plugin
  'cordovaFacebookConnect', 'cordovaWebIntent', 'cordovaGoogleAnalystics', 'cordovaEmailComposer', 'facebookSDK', 'config',
  // include core utils
  'myApp',
  'utils/bridge',
  'utils/flag',
  'router',
  'splash',
  // config
  'config'
], function(require) {
  $(function() {
    var App = require('myApp')
       ,Bridge = require('utils/bridge')
       ,Config = require('config')
       ,Splash = require('splash');

    /*  
     *  (o)deviceready : Cordova init finish
     *  (x)viewready : async init module view finish
     *  (x)modelready : async init model finish
     *  (x)pageready : sync render page finish
     *  (x)appready : initialize finish
     */

    /*
     *  Bind appready callback
     */
    var initEvents = ['viewready', 'modelready', 'pageready']
       ,initFlag = 0;
    $(document).one(initEvents.join(' '), function(e) {
      initFlag++;
      if (initFlag == initEvents.length) $(document).trigger('appready');
    });
    $(document).one('appready', Splash);

    /*  
     *  Initialize global Dom
     */
    window.waitingSpinner = (function() {
      var spinner = $('<div>').addClass('waiting-spinner').css('height', $(window).height())
         ,shader = $('<div>').addClass('shader')
         ,img = $('<img>').attr('src', 'res/img/spinner.gif');
      spinner.append(shader.append(img)).appendTo($('body'));
      return {
        start: function() {
          spinner.show();
          window.setTimeout(function() {
            if (spinner.css('display') === 'block') {
              spinner.hide();
            }
          }, 25000);
        },
        stop: function() {
          spinner.hide();
        }
      }
    })();

    // @TODO
    // Platform javascript
    if (myDevice.isAndroid()) {
      // Android
      $('body').on('focus', 'input', function(e) {
        if ($(e.target).hasClass('card')) {
          $('.page.register .wrapper').css('height', '700px')
          $('.page.register .content').scrollTop(700)
        }
      }).on('blur', 'input', function(e) {
        if ($(e.target).hasClass('card')) {
          $('.page.register .content').scrollTop(100)
        }
      });
      // Prevent Android version > 4.0 scrolling issue
      $('body').on('touchmove', function(e) {
        e.preventDefault();
      });
      // Prevent Android version > 4.0 to disable browser 'Save Password' functionality
      // $('input[type="password"]').attr('autocomplete', 'off');
    } else {
      // iOS keyboard hack
      // make input trigger more sensitive
      $('body').on('touchstart', 'input', function(e) {
        $(e.target).trigger('focus');
        e.stopPropagation();
      }).on('blur', 'input', function() {
        // blur keyboard fix
        if (window.pageYOffset <= 50) window.scrollTo(0, 0);
      });

      // disable the iOS default scrolling behavier of UIWebView
      $('body').on('touchmove touchstart touchend', function(e) {
        e.preventDefault();
      });
    }

    /*  
     *  Initialize Cordova plugin 
     */
    if (myDevice.isCordova()) {
      // Bind custom Cordova event
      $(document).on('showkeyboard', Bridge.showKeyboard)
                 .on('hidekeyboard', Bridge.hideKeyboard)
                 .on('backbutton', Bridge.backButton);

      // init GA plugin
      var googleAnalytics = window.plugins.googleAnalyticsPlugin
         ,platform = window.device.platform + ',' + window.device.version + ',' + window.device.name;
      googleAnalytics.startTrackerWithAccountID(Config.GAId);
      googleAnalytics.setCustomVariable('1', 'JPON Mobile', 'v1.2');
      googleAnalytics.trackEvent('Application Operation', 'Launch JPON Mobile App', platform, 1);
      // init FB plugin
      FB.init({
        appId: Config.FBId,
        nativeInterface: CDV.FB,
        useCachedDialogs: false
      });
    }

    /*  
     *  Initialize model & view 
     */
    App.init();

  });
});