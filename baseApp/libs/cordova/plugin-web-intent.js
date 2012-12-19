define(function() {
  /**
   * cordova Web Intent plugin
   * Copyright (c) Boris Smus 2010
   */
  var WebIntent = function() {};

  if (!window.plugins) window.plugins = {};
  var cordova = (window.cordova && window.cordova.exec) ? window.cordova :
    {
      exec: function(action) {
        // eat all GA event if cordova is undefined
      }
    };

  WebIntent.ACTION_SEND = "android.intent.action.SEND";
  WebIntent.ACTION_VIEW = "android.intent.action.VIEW";
  WebIntent.EXTRA_TEXT = "android.intent.extra.TEXT";
  WebIntent.EXTRA_SUBJECT = "android.intent.extra.SUBJECT";
  WebIntent.EXTRA_STREAM = "android.intent.extra.STREAM";
  WebIntent.EXTRA_EMAIL = "android.intent.extra.EMAIL";

  WebIntent.prototype.startActivity = function(params, success, fail) {
    return cordova.exec(function(args) {
      success(args);
    }, function(args) {
      fail(args);
    }, 'WebIntent', 'startActivity', [params]);
  };

  WebIntent.prototype.hasExtra = function(params, success, fail) {
    return cordova.exec(function(args) {
      success(args);
    }, function(args) {
      fail(args);
    }, 'WebIntent', 'hasExtra', [params]);
  };

  WebIntent.prototype.getUri = function(success, fail) {
    return cordova.exec(function(args) {
      success(args);
    }, function(args) {
      fail(args);
    }, 'WebIntent', 'getUri', []);
  };

  WebIntent.prototype.getExtra = function(params, success, fail) {
    return cordova.exec(function(args) {
      success(args);
    }, function(args) {
      fail(args);
    }, 'WebIntent', 'getExtra', [params]);
  };

  WebIntent.prototype.onNewIntent = function(callback) {
    return cordova.exec(function(args) {
      callback(args);
    }, function(args) {}, 'WebIntent', 'onNewIntent', []);
  };

  WebIntent.prototype.sendBroadcast = function(params, success, fail) {
    return cordova.exec(function(args) {
      success(args);
    }, function(args) {
      fail(args);
    }, 'WebIntent', 'sendBroadcast', [params]);
  };

  WebIntent.prototype.sendEmail = function(subject, body, opt_email) { 
    var extras = {};
    extras[WebIntent.EXTRA_SUBJECT] = subject;
    extras[WebIntent.EXTRA_TEXT] = body;
    extras[WebIntent.EXTRA_EMAIL] = opt_email;
    window.plugins.webIntent.startActivity({ 
        action: WebIntent.ACTION_SEND,
        type: 'text/html', 
        extras: extras 
      }, 
      function() {}, 
      function() {
        alert('Failed to send email via Android Intent');
      }
    ); 
  };
  window.plugins.webIntent = new WebIntent();
});