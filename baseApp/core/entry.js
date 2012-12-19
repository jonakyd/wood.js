(function() {
  function initialize() {
    var splashScript = document.createElement('script');
    splashScript.setAttribute('type', 'text/javascript');
    splashScript.setAttribute('src', 'libs/require.js');
    splashScript.setAttribute('data-main', 'core/init.js');
    document.getElementsByTagName('head')[0].appendChild(splashScript);
  }
  // do initialize after Cordova.js ready
  if (isCordova) document.addEventListener('deviceready', initialize, false);
  else setTimeout(initialize, 0);
})()