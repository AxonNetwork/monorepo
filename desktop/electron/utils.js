const path = require('path')

module.exports.getAppPath = function() {
    try {
        return require('electron').app.getAppPath()
    } catch (err) {
        return require('electron').remote.app.getAppPath()
    }
}

module.exports.getEnv = function() {
    const appPath = module.exports.getAppPath()
    const binariesPath = path.join(appPath, '../desktop/build-resources/binaries')
    const env = Object.assign({}, process.env, { CONSCIENCE_APP_PATH: appPath, CONSCIENCE_BINARIES_PATH: binariesPath })
    env.PATH = binariesPath + ':' + env.PATH + ':/usr/local/bin:/usr/bin:/usr/sbin:/sbin'
    return env
}
