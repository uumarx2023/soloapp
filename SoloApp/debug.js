var config = {};

global.codigo = 'prova';
global.configurationFile = __dirname + "/config.json";

var server = require("./server.js");
server.startServer(8000);

var db = require("./db.js");
