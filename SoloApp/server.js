var WEBServer = require("./webServer.js");
var infocines = require("./infocines.js");
var db = require("./db.js");

exports.startServer = function(port, callback) {

	WEBServer.startWebServer(port, function (app, server) {
		db.setup(app);
		infocines.setup(app);
	}, callback);

}
