/*  
 *  iOS   
 *  if pass a null object to JSON.parse, Android 2.3.3 will throw error
 *  Uncaught illegal access at file:///android_asset/www/libs/backbone.localStorage.js:65 
 */
JSON.originalParse = JSON.parse;
JSON.parse = function(text) {
  if (text) return JSON.originalParse(text);
  else return null;
}