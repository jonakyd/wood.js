define(function() {
  var myDevice = window.myDevice = {}
     ,cordovaDevice = window.device;

  myDevice.isCordova = function() {
    return cordovaDevice && cordovaDevice.cordova;
  }

  /*
   *  Platform identifying
   *  buildPlatform flag > Cordova identify > browser identify  
   */
  myDevice.isAndroid = function() {
    return (buildPlatform === 'android') ||
           (myDevice.isCordova() && (cordovaDevice.platform === 'Android')) ||
           (/android/gi).test(navigator.appVersion);
  }
  myDevice.isIOS = function() {
    return (buildPlatform === 'ios') ||
           (myDevice.isCordova() && ((cordovaDevice.platform === 'iPhone') || (cordovaDevice.platform === 'iPod touch'))) ||
           (/iphone|ipad/gi).test(navigator.appVersion);
  }

  // it will keep return false if not in hybrid 
  myDevice.getVersion = function() {
    return (myDevice.isCordova() && parseFloat((cordovaDevice.version).split('-')[0], 10));
  }
});