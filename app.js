const electron = require('electron')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

var flags = require('simple-flags');
var init = require('./lib/init');
var Web = require('./lib/web');
var docker = require('./lib/docker');

var pandoraServerPort = 24326
var padoraClientPort = 24328

var options = flags({
    'all': false,
    'cli': false
})

options.cli = (options.docker)

if (options.cli) {
    if (options.docker) {
        init(pandoraServerPort, (err, data) => {
            if (err) {
                return console.error(err)
            }

            data.options = options;
            docker(data)
        })
    }
} else {

    function createWindow() {
        var web = Web(padoraClientPort, pandoraServerPort);

        mainWindow = new BrowserWindow({
            width: 400,
            height: 600,
            webPreferences: {
                nodeIntegration: false
            },
        })

        mainWindow.loadURL(`http://localhost:${padoraClientPort}`)

        mainWindow.webContents.openDevTools()

        mainWindow.on('closed', function() {
            mainWindow = null
        })
    }

    app.on('ready', () => {
        createWindow()
    });

    app.on('window-all-closed', function() {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', function() {
        if (mainWindow === null) {
            createWindow()
        }
    })
}
