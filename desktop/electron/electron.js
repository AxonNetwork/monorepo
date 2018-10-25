

const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;

const path = require('path');
const url = require('url');
const fork = require('child_process').fork;
const spawn = require('child_process').spawn;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow; let
    repoServer;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ resizable: true, titleBarStyle: 'hidden', webPreferences: { webSecurity: false } });
    mainWindow.maximize();

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../dist-bundle/prod/index.html'),
        protocol: 'file:',
        slashes: true,
    });

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
    startRepoServer()
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

function startRepoServer() {
    const program = path.resolve(__dirname, './repo-process/index.js');
    const parameters = [];
    const options = {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    };
    repoServer = fork(program, parameters, options);

    ipcMain.on('message', (event, arg) => {
        repoServer.send(JSON.stringify(arg));
    });

    repoServer.on('message', (message) => {
        mainWindow.webContents.send('message', JSON.stringify(message));
    });

    repoServer.stdout.on('data', (data) => {
        console.log(`Repo Process:\n${data}`);
    });

    repoServer.stderr.on('data', (data) => {
        console.error(`Repo Process error:\n${data}`);
    });
}

var nodeProc = null
function startNode() {
    const appPath = require('electron').app.getAppPath()
    const fs = require('fs')
    const nodePath = path.join(appPath, '../desktop/build-resources/binaries/conscience-node')
    console.log('nodePath ~>', nodePath)
    nodeProc = spawn(nodePath)
    nodeProc.stdout.on('data', data => {
        fs.appendFileSync('/tmp/conscience-stdout', data)
    })
    nodeProc.stderr.on('data', data => {
        fs.appendFileSync('/tmp/conscience-stderr', data)
    })
}

app.on('will-quit', () => {
    nodeProc.kill()
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
