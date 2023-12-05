const ADODB = require('node-adodb');
ADODB.debug = true
global.connection = null;

exports.setup = function() {
    global.connection = ADODB.open(global.config.infocines.database);
}

exports.getConnection  = function(callback) {
	callback(global.connection);
}

exports.execSql = function(sql, callback) {

    exports.getConnection(function (connection) {
        connection.query(sql)
            .then(data => {
                callback(data);
            })
            .catch(error => {
                console.error("ERROR!!!!");
                setTimeout(function () {
                    exports.execSql(sql, callback);
                }, 500);                
                //console.error(error);
            });
    });
    
}

exports.getConfig = function(callback) {
    var sql =  "SELECT Nombre as nombre, Valor as valor FROM parametros where grupo ='MPM' and nombre in ('PATH_INFORMACIO', 'PATH_VIDEOS', 'PATH_IMAGES72', 'PATH_IMG_ANEXO2', 'PATH_IMAGES300', 'PATH_IMG_ANEXO1', 'PATH_PANTALLAS')";
    exports.execSql(sql, function (data) {
        var config = {params: {}};
        for (var p of data) {
            config.params[p.nombre] = p.valor;
        }
        callback(config);
    });
}

exports.getInfo = function(codigo, callback) {
    var sql = "SELECT infod.orden, infod.tipo, infod.path, infod.duracion, infod.sala FROM infod, infom where infod.IdinfoM=infom.IdinfoM and infom.codigo  ='" + codigo + "' order by orden";
    exports.execSql(sql, function (data) {
        callback({codigo: codigo, info: data});
    });
}

exports.getInfoProxima = function(sala, callback) {
    var sql = " SELECT actual, h1, h2, h3, h4, h5, h6, h7 " + 
              " FROM monitores where sala = '" + sala + "' and tvis='T1' and actual<>0 order by linea";
    exports.execSql(sql, function (data) {
		var h1 = "";
        if (data.length>0) data = data[0];
		if ( [1,2,3,4,5,6,7].indexOf(data.actual) != -1) {
			h1 = data['h' + data.actual];
		} 
		callback({h1: h1});	
    });
}

exports.getInfoHorario = function(sala, callback) {
    var sql = 	" SELECT titulo, sala, h1, h2, h3, h4, h5, h6, h7, e1, e2, e3, e4, e5, e6, e7, duracio, clasif, path, path2, texto1, texto2, texto3, texto4, texto5, txtclassif, txtsala, txtsonido " + 
				" FROM monitores where sala  = '" + sala + "' and tvis='T1' and actual<>0 order by linea";    
    exports.execSql(sql, function (data) {
        if (data.length>0) data = data[0];

/*        
        data['h1'] = "01:00";
        data['h2'] = "02:00";
        data['h3'] = "03:00";
        data['h4'] = "";
        
        data['h4'] = "04:00";
        data['h5'] = "05:00";
        data['h6'] = "06:00";
*/       
        callback(data);
    });
    
}
