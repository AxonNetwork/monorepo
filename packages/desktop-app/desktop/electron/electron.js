
const psTree = require('ps-tree')
const fixPath = require('fix-path')
// on OSX, electron loses the user's PATH
fixPath()

const electron = require('electron')

const app = electron.app
const shell = electron.shell
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipcMain = electron.ipcMain

const fs = require('fs')
const path = require('path')
const url = require('url')
const fork = require('child_process').fork
const spawn = require('child_process').spawn
const fileServer = require('./fileServer')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let repoServer

// fs.writeFileSync('/tmp/conscience-version', '0.1.0')

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ resizable: true, titleBarStyle: 'hidden', webPreferences: { webSecurity: false, plugins: true } })
    mainWindow.maximize()

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../dist-bundle/prod/index.html'),
        protocol: 'file:',
        slashes:  true,
    })

    mainWindow.loadURL(startUrl)

    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    // function writeLog() {
    //     let str = Array.prototype.join.call(arguments, ' ')
    //     // fs.appendFileSync('/tmp/auto-update', str + '\n')
    // }
    // const { autoUpdater } = require('electron-updater')
    // autoUpdater.logger = {
    //     info: writeLog.bind(null, '[auto-update info]'),
    //     warn: writeLog.bind(null, '[auto-update warn]'),
    //     error: writeLog.bind(null, '[auto-update error]'),
    // }
    // autoUpdater.on('update-available', () => {
    //     writeLog('update-available :D')
    // })
    // autoUpdater.on('update-not-available', () => {
    //     writeLog('update-not-available :( :( :(')
    // })
    // autoUpdater.checkForUpdatesAndNotify().then(x => console.log('update ~>', x))


    createWindow()
    fileServer.start()
    startNode()
    const app = require('electron').app
    const menu = createMenu(app, shell)
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))

    ipcMain.on('start_node', () => {
        startNode()
        mainWindow.webContents.send('node_started')
    })

    ipcMain.on('kill_node', () => {
        killNode(() => {
            mainWindow.webContents.send('node_killed')
        })
    })
})

// Redirect <a> tag links to an external browser
app.on('web-contents-created', (event, webContents) => {
    webContents.on('will-navigate', (event, url) => {
        if (process.env.NODE_ENV === 'development' && url.indexOf('http://localhost:3004') === 0) {
            // this is probably the hot module reloader re-navigating to the app bundle, so don't block it
        } else {
            event.preventDefault()
            shell.openExternal(url)
        }
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

function getEnv() {
    const appPath = app.getAppPath()

    const binariesPath = process.env.NODE_ENV === 'development'
        ? path.join(appPath, 'desktop', 'build-resources', 'binaries', getPlatformBinaryFolder())
        : path.join(appPath, '..', 'desktop', 'build-resources', 'binaries', getPlatformBinaryFolder())

    const env = Object.assign({}, process.env, {
        CONSCIENCE_APP_PATH:      appPath,
        CONSCIENCE_BINARIES_PATH: binariesPath,
        PATH:                     [ binariesPath, process.env.PATH ].join(path.delimiter), // ':/usr/local/bin:/usr/bin:/usr/sbin:/sbin',
        BUGSNAG_ENABLED:          '1',
        RELEASE_STAGE:            process.env.NODE_ENV === 'development' ? 'dev' : 'prod',
    })
    return env
}

let isKilled = false
let nodeProc = null
function startNode() {
    const env = getEnv()
    const nodePath = path.join(env.CONSCIENCE_BINARIES_PATH, `conscience-node${getPlatformBinaryExtension()}`)

    // fs.writeFileSync('/tmp/conscience-app-env.json', JSON.stringify(process.env))
    // fs.writeFileSync('/tmp/conscience-electron-env.json', JSON.stringify(env))
    // fs.writeFileSync('/tmp/conscience-electron-nodePath', nodePath)

    nodeProc = spawn(nodePath, [], { env })
    // nodeProc.stdout.on('data', data => { fs.appendFileSync('c:\\Users\\Daniel\\conscience-stdout.txt', data) })
    // nodeProc.stderr.on('data', data => { fs.appendFileSync('c:\\Users\\Daniel\\conscience-stderr.txt', data) })
}

function killNode(cb) {
    if (isKilled) {
        cb()
    }
    if (nodeProc) {
        psTree(nodeProc.pid, (err, children) => {
            if (err) { return console.log('err', err) }
            children.map(c => parseInt(c.PID, 10)).forEach((pid) => {
                try {
                    process.kill(pid)
                } catch (err) { console.log('err killing child', err) }
            })
            try {
                process.kill(nodeProc.pid)
            } catch (err) { console.log('err killing parent', err) }
            isKilled = true
            cb()
        })
    } else {
        isKilled = true
        cb()
    }
}

app.on('before-quit', (event) => {
    if (!isKilled) {
        event.preventDefault()
        killNode(() => {
            app.quit()
        })
    }
})

// Add React Dev Tools
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer')
const createMenu = require('./menu')

app.on('ready', () => {
    [ REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS ].forEach((extension) => {
        installExtension(extension)
            .then(name => console.log(`Added Extension: ${name}`))
            .catch(err => console.log('An error occurred: ', err))
    })
})

function getPlatformBinaryFolder() {
    switch (process.platform) {
    case 'darwin':
    case 'linux':
        return process.platform
    case 'win32':
        return 'windows'
    default:
        throw new Error(`unknown process.platform '${process.platform}'`)
    }
}

function getPlatformBinaryExtension() {
    switch (process.platform) {
    case 'darwin':
    case 'linux':
        return ''
    case 'win32':
        return '.exe'
    default:
        throw new Error(`unknown process.platform '${process.platform}'`)
    }
}
