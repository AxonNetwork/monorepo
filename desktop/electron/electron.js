

const fixPath = require('fix-path')
// on OSX, electron loses the user's PATH
fixPath()

const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipcMain = electron.ipcMain

const fs = require('fs')
const path = require('path')
const url = require('url')
const fork = require('child_process').fork
const spawn = require('child_process').spawn

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let repoServer

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ resizable: true, titleBarStyle: 'hidden', webPreferences: { webSecurity: false } })
    mainWindow.maximize()

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../dist-bundle/prod/index.html'),
        protocol: 'file:',
        slashes: true,
    })

    mainWindow.loadURL(startUrl);

    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow()
    startNode()
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

function getEnv() {
    const appPath      = app.getAppPath()
    const binariesPath = process.env.NODE_ENV === 'development'
        ? path.join(appPath, 'desktop/build-resources/binaries')
        : path.join(appPath, '../desktop/build-resources/binaries')

    const env = Object.assign({}, process.env, {
        CONSCIENCE_APP_PATH: appPath,
        CONSCIENCE_BINARIES_PATH: binariesPath,
        PATH: binariesPath + ':' + process.env.PATH + ':/usr/local/bin:/usr/bin:/usr/sbin:/sbin',
    })
    return env
}

var nodeProc = null
function startNode() {
    const env = getEnv()
    const nodePath = path.join(env.CONSCIENCE_BINARIES_PATH, 'conscience-node')

    fs.writeFileSync('/tmp/conscience-app-env.json', JSON.stringify(process.env))
    fs.writeFileSync('/tmp/conscience-electron-env.json', JSON.stringify(env))
    fs.writeFileSync('/tmp/conscience-electron-nodePath', nodePath)

    nodeProc = spawn(nodePath, [], { env })
    nodeProc.stdout.on('data', data => { fs.appendFileSync('/tmp/conscience-stdout', data) })
    nodeProc.stderr.on('data', data => { fs.appendFileSync('/tmp/conscience-stderr', data) })
}

app.on('will-quit', () => {
    if (nodeProc) {
        nodeProc.kill()
    }
})

// Add React Dev Tools
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

app.on('ready', () => {
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach((extension) => {
        installExtension(extension)
            .then(name => console.log(`Added Extension: ${name}`))
            .catch(err => console.log('An error occurred: ', err));
    });
});
