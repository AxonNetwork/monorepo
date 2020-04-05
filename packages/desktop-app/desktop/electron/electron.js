
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

    ipcMain.on('update:check', () => {
        const updater = doAutoUpdate()

        updater.on('update-available',     () => mainWindow.webContents.send('update:available'))
        updater.on('update-not-available', () => mainWindow.webContents.send('update:not-available'))
        updater.on('update-downloaded',    () => mainWindow.webContents.send('update:downloaded'))
        updater.on('error',                (err) => mainWindow.webContents.send('update:error', err))
        updater.on('download-progress', (a, b, c, d, e, f) => {
            console.log('download-progress', a, b, c, d, e, f)
            mainWindow.webContents.send('update:download-progress', a, b, c, d, e, f)
        })

        ipcMain.on('update:quit-and-install', () => {
            updater.quitAndInstall()
        })
    })
})

function doAutoUpdate() {
    const { autoUpdater } = require('electron-updater')
    autoUpdater.logger = {
        info: msg => log('axon.auto-update', 'info', msg),
        warn: msg => log('axon.auto-update', 'warn', msg),
        error: msg => log('axon.auto-update', 'error', msg),
    }
    // autoUpdater.on('update-available', () => {
    //     writeLog('update-available :D')
    // })
    // autoUpdater.on('update-not-available', () => {
    //     writeLog('update-not-available :( :( :(')
    // })
    autoUpdater.checkForUpdatesAndNotify().then(x => console.log('update ~>', x))

    return autoUpdater
}

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

function log(file, label, msg) {
    let logDir
    try {
        logDir = app.getPath('logs')
    } catch (err) {
        logDir = app.getPath('home')
    }
    fs.appendFileSync(path.join(logDir, file) + '.log', '[' + label + '] ' + msg + '\n')
}

let isKilled = false
let nodeProc = null
function startNode() {
    const env = getEnv()
    const nodePath = path.join(env.CONSCIENCE_BINARIES_PATH, `axond${getPlatformBinaryExtension()}`)

    // fs.writeFileSync('c:\\Users\\bryn\\Desktop\\conscience-app-env.json', JSON.stringify(process.env))
    // fs.writeFileSync('c:\\Users\\bryn\\Desktop\\conscience-electron-env.json', JSON.stringify(env))
    // fs.writeFileSync('c:\\Users\\bryn\\Desktop\\conscience-electron-nodePath', nodePath)

    log('axon.node', 'info', 'spawning node process...')

    nodeProc = spawn(nodePath, [], { env })
    nodeProc.on('error', err => { log('axon.node', 'error', err) })
    nodeProc.stdout.on('data', data => { log('axon.node', 'stdout', data) })
    nodeProc.stderr.on('data', data => { log('axon.node', 'stderr', data) })

    isKilled = false

    log('axon.node', 'info', 'done spawning node process...')
}

function killNode(cb) {
    log('axon.node', 'info', `killing node process (pid: ${nodeProc.pid})...`)
    if (isKilled) {
        log('axon.node', 'info', 'node process already killed')
        return cb()
    }
    if (nodeProc) {
        psTree(nodeProc.pid, (err, children) => {
            if (err) {
                log('axon.node', 'error', 'error killing node process: error calling psTree: ' + err.toString())
                return console.log('err', err)
            }
            children.map(c => parseInt(c.PID, 10)).forEach((pid) => {
                log('axon.node', 'info', `psTree found pid ${pid}`)
                try {
                    process.kill(pid)
                } catch (err) {
                    console.log('err killing child', err)
                    log('axon.node', 'error', 'error killing node process: error calling process.kill: ' + err.toString())
                }
            })
            try {
                process.kill(nodeProc.pid)
            } catch (err) {
                console.log('err killing parent', err)
                log('axon.node', 'error', 'error killing node process: error killing parent: ' + err.toString())
            }
            isKilled = true
            log('axon.node', 'info', 'done killing node process')
            cb()
        })
    } else {
        isKilled = true
        log('axon.node', 'info', 'done killing node process (but weird state)')
        cb()
    }
}

app.on('before-quit', (event) => {
    log('axon.node', 'info', `received "before-quit" event, attempting to kill node... (isKilled = ${isKilled})`)
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
