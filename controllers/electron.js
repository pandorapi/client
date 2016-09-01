var Web = require('./web')
const electron = require('electron')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

function createWindow(options) {
    var web = Web(options);

    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        center: true,
        skipTaskbar: true,
        darkTheme: true,
        title: "PandoraPi",
        webPreferences: {
            nodeIntegration: false
        },
    })

    mainWindow.setMenu(null)

    mainWindow.loadURL(`http://localhost:${options.clientPort}`)

    if (options.inspect) {
        mainWindow.webContents.openDevTools()
    }
    mainWindow.on('closed', function() {
        mainWindow = null
    })
}

module.exports = (options) => {
    app.on('ready', () => {
        createWindow(options)
    });

    app.on('window-all-closed', function() {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', function() {
        if (mainWindow === null) {
            createWindow(options)
        }
    })
}
