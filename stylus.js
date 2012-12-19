var fs = require('fs');

var stylusParser = function(path) {
  var stylus = require('stylus'), 
      text = fs.readFileSync(path, 'utf8'),
      targetFile = path.replace("styl","css");
  try {
    stylus(text).render(
      function(err, css){
        if (err) throw err;
        fs.writeFile(targetFile, css, function (err) {
          if (err) throw err;
          console.log("Parsed : " + targetFile);
        });
    });
  } catch (err) {
    console.log("Parse Error : \n" + err.message);
  } 
}
var fileWatcher = function(path) {
  this.path = path;
  this.start = function() {
    var wf = this.path;
    fs.watch(wf, function() {
      stylusParser(wf);
    });
  }
}


var execFile = require('child_process').execFile;
execFile('find', [ './baseApp', "-name", "*.styl" ], function(err, stdout, stderr) {
  var fileList = stdout.split('\n');
  for (var i = 0; i < fileList.length; i++) {
    var wf = fileList[i];
    if (wf.length <= 0) return;
    console.log("Watching : " + wf);
    var watcher = new fileWatcher(wf);
    watcher.start();
  };
});