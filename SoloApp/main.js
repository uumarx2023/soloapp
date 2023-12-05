const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const fs = require('fs')
const url = require('url')

let mainWindow

global.configurationFile = path.join(path.dirname(process.argv[0]), 'config.json');

if (!fs.existsSync(global.configurationFile)) {
  global.configurationFile = path.join(__dirname, "config.json");
}

var config = {};

var defaultUrl = url.format({ pathname: path.join(__dirname, "dist/index.html"), hash:"", protocol: 'file:', slashes: true });

for (var i=1; i<process.argv.length;i++) {
    var prm = process.argv[i];

    if (prm.substr(0,7)=="config=") {
      global.configurationFile = __dirname + "/" + prm.substr(7);
    } 
}

var config = JSON.parse(
    fs.readFileSync(global.configurationFile)
);

global.codigo = '???'

for (var i=1; i<process.argv.length;i++) {
    var prm = process.argv[i];

    if (prm.substr(0,7)=="config=") {
      global.configurationFile = __dirname + "/" + prm.substr(7);
    } else if (prm.substr(0,7)=="screen=") {
      config.windows[0].screen=parseInt(prm.substr(7));
    } else if (prm.substr(0,7)=="debug=s") {
      config.windows[0].debug = true;
    } else if (prm.substr(0,7)=="server=") {
      config.serverport = parseInt(prm.substr(7));
    } else if (prm.substr(0,7)=="codigo=") {
      global.codigo = prm.substr(7);
    } else {
      config.windows[0].url = 	prm;
    }
}

if (config.serverport) defaultUrl = "http://localhost:" + config.serverport;
	
console.log(config);

function createWindows() {

  let displays = electron.screen.getAllDisplays()

  for (var window in config.windows) {
      
      var cfg = config.windows[window];

      if(displays.length <= cfg.screen) cfg.screen = 0;

      if (!cfg.url) cfg.url = defaultUrl;

      console.log('create window', cfg);

      mainWindow = new BrowserWindow({width: 800, height: 600, frame: false})

      mainWindow.setBounds(displays[cfg.screen].bounds)

      mainWindow.maximize()
      
      console.log("load" + cfg.url);
      mainWindow.loadURL(cfg.url);

      if (cfg.debug) mainWindow.webContents.openDevTools();

     // mainWindow.loadURL("data:text/html;charset=utf-8," + encodeURI(global.configurationFile));

      mainWindow.on('closed', function () {
        mainWindow = null
      })
  }

}

console.log("x");

app.on('ready', function () {
  console.log("onRedy");
  createWindows();
})

app.on('activate', function () {
  console.log("onActivate");
  if (mainWindow === null) {
    createWindows();
  }
})

app.on('window-all-closed', function () {
    app.quit()
})

if (config.serverport) {
	var server = require("./server.js");
	server.startServer(config.serverport);
}

