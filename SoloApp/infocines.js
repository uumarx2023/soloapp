const express = require('express')
const fs = require('fs');
const http = require('http');
const db = require("./db.js");

function http_get(url, callback) {

    http.get(url, (resp) => {
        let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
       callback(data);
    });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

function getDbConfig(req, res) {
    
    db.getConfig((config)=>{
        res.send(config);
    });
    
}

function getInfo(req, res) {
    
    db.getInfo(req.query.codigo || global.codigo, (info)=>{
        res.send(info);
    });
    
}

function getInfoProxima(req, res) {
    
    db.getInfoProxima(req.query.sala, (info)=>{
        res.send(info);
    });
    
}

function getInfoHorario(req, res) {
    
    db.getInfoHorario(req.query.sala, (info)=>{
        res.send(info);
    });
    
}

function getInfoHtml(req, res) {
        
    var sql = fs.readFileSync(o.params.PATH_PANTALLAS + "\\" + req.query.tipo + ".sql").toString();
    
    db.execSql(sql, (info)=>{
        res.send({datos: info});
    });

}

exports.setup = function(webServer) {

    db.getConfig((o)=>{

        global.o = o;

        webServer.use('/images/path1/', express.static(o.params.PATH_IMAGES72));
        webServer.use('/images/path2/', express.static(o.params.PATH_IMAGES300));
        webServer.use('/images/path3/', express.static(o.params.PATH_IMG_ANEXO1));
        webServer.use('/images/path4/', express.static(o.params.PATH_IMG_ANEXO2));

        webServer.use('/images', express.static(o.params.PATH_INFORMACIO));
        webServer.use('/videos', express.static(o.params.PATH_VIDEOS));

        webServer.use('/pantallas/', express.static(o.params.PATH_PANTALLAS));
        
    });


    webServer.get('/rest/dbconfig', getDbConfig);
    webServer.get('/rest/info', getInfo);
    webServer.get('/rest/info/proxima', getInfoProxima);
    webServer.get('/rest/info/horario', getInfoHorario);
    webServer.get('/rest/info/html', getInfoHtml);

}
