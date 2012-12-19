define(['config', 'backbone', 'backbone.localstorage'], function(Config, Backbone) {
  return Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage('user'),
    urlRoot: Config._isProduction ? Config.urlRoot.production : Config.urlRoot.staging,
    _doRequest: function(requestObj, opt_onError) {
      if (navigator.network) {
        var network = navigator.network.connection.type
           ,isNetworkFailed = (network === 'unknown'|| network === 'none');
      }
      if (isNetworkFailed) {
        waitingSpinner.stop();
        Bridge.alert('網路不通');
        if (opt_onError) opt_onError();
      } else {
        $.ajax($.extend({
          // fix Android will cache Ajax request
          cache: false
        }, requestObj));
      }
    }
  });
});
