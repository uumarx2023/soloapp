const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

var webServer;

function loadConfig(req, res) {
    var fs = require('fs');
    
    //var configurationFile = __dirname + "/config.json";

    global.config = JSON.parse(
        fs.readFileSync(global.configurationFile)
    );
}

function getConfig(req, res) {
    
    //global.config;

    var config={
        ver:"1",
        codigo: req.query.codigo || global.codigo
    }
    
    res.send(config);
}

exports.startWebServer = function(port, setupFn, callback) {

    loadConfig();
    
    port = port || 8000;
    
    webServer = express();

    const server = http.createServer(webServer);

    webServer.use(bodyParser.text());
    webServer.use(bodyParser.json());
    webServer.use(bodyParser.urlencoded({extended: true}));
    webServer.use(express.static(__dirname + '/public'));
    webServer.get('/config', getConfig);
    webServer.get('/rest/config', getConfig);

    if (setupFn) setupFn(webServer, server);
    
    server.listen(port, function () {
        console.log('server listening on port ' + port)
        if (callback) callback(server);
    });    

}
