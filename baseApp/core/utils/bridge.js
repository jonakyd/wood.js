define(['config', 'myApp'], function(Config, App) {
  var Bridge = window.Bridge = {};

  Bridge.alert = function() {
    var APP_NAME = Config.appName;
    if (_.isUndefined(window.navigator.notification)) window.alert(arguments[0]);
    else window.navigator.notification.alert(arguments[0], arguments[1], APP_NAME, arguments[2]);
  }

  Bridge.backButton = function() {
    var currentPageName = App.Page.getCurrentPageName(); 
    if (currentPageName === 'home' || currentPageName === 'auth') {
        navigator.notification.confirm('是否離開', function(buttonIndex) {
          if (buttonIndex == 2) navigator.app.exitApp();
        }, Config.appName, '否,是');
    } else App.Page.getCurrentPage().navigationBar.back();
  }

  Bridge.hideKeyboard = function(e) {
    // android won't trigger blur when close the keyboard
    // you have to manually trigger 
    // $('.hidden-input').focus();
    // you also can use scroll to to trigger blur
  }

  Bridge.showKeyboard = function(e) {
  }
  return Bridge;
});