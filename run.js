var argv = require('optimist').usage('Usage: {OPTIONS}').wrap(80).option('run', {
	alias: 'r',
	desc: 'Run Server Directly'
}).option('build', {
	alias: 'b',
	desc: 'Build baseApp To baseAppBuild'
}).option('live', {
	alias: 'l',
	desc: 'Run server with LiveReload support'
}).option('debug', {
	alias: 'd',
	desc: 'Run server and debug with weinre'
}).option('port', {
	alias: 'p',
	desc: 'Server Port'
}).option('annotation', {
	alias: 'a',
	desc: 'Render annotation'
}).option('help', {
	alias: 'h',
	desc: 'Show this message'
}).check(function(argv) {
	if (argv.help) {
		throw '';
	}
}).argv,
	rightCmd = false,
	port = parseInt(argv.port) || 3333;

function build() {
	var sys = require('util'),
		exec = require('child_process').exec,
		bcmd = "node r.js -o baseApp/_app.build.js";

	function puts(error, stdout, stderr) {
		sys.puts(stdout);
		sys.puts(stderr);
	}
	console.log("Run : " + bcmd);
	exec(bcmd, puts);
}

function runServer() {
	var express = require('express')
     ,app = module.exports = express.createServer()
     ,baseDir = __dirname + "/baseApp"
     ,network = {};

	app.configure(function() {
		app.use(express.logger());
		app.use(express.bodyParser());
		app.use(express.cookieParser());
    app.use(express.static(baseDir));
		app.use(app.router);
	});
	console.log("Starting at : " + baseDir + " Port : " + port);
	require('dns').lookup(require('os').hostname(), function(err, add, fam) {
    // mobile debug view
		app.get('/mobile', function(req, res) {
			res.render(baseDir + '/mobile.ejs', { 
				liveReload: argv.live || false,
				ip: add,
				port: port,
				layout: false 
			});
		});
		app.listen(port);
		console.log("Run : http://" + add + ":" + port + "/");
	});
}

function debugServer() {
	var sys = require('util'),
		exec = require('child_process').exec;
	require('dns').lookup(require('os').hostname(), function(err, add, fam) {
		var cmd = "java -jar weinre.jar --boundHost " + add + " --httpPort 3210 --verbose true &";
		console.log("Browse debug console At : http://" + add + ":3210/");

		function puts(error, stdout, stderr) {
			sys.puts(stdout)
		}
		exec(cmd, puts);
	});
}

function renderAnnotation() {
	var sys = require('util'),
		exec = require('child_process').exec,
		bcmd = "./jsdoc/jsdoc -r baseApp/core/";

	function puts(error, stdout, stderr) {
		sys.puts(stdout);
		sys.puts(stderr);
	}
	console.log("Run : " + bcmd);
	exec(bcmd, puts);
}
if (argv.build != null) {
	rightCmd = true;
	build();
}
if (argv.run != null) {
	rightCmd = true;
	runServer();
}
if (argv.debug != null) {
	rightCmd = true;
	runServer();
	debugServer();
}
if (argv.annotation != null) {
	rightCmd = true;
    renderAnnotation();
}
if (!rightCmd) {
	console.log("ERROR: Try -h for help");
}
