const path = (window as any).require('path')
const spawn = (window as any).require('child_process').spawn

function getAppPath() {
    return (window as any).require('electron').remote.app.getAppPath()
}

function getEnv() {
    const binariesPath = process.env.NODE_ENV === 'development'
        ? path.join(getAppPath(), 'desktop/build-resources/binaries')
        : path.join(getAppPath(), '../desktop/build-resources/binaries')

    const env = Object.assign({}, process.env, {
        CONSCIENCE_APP_PATH: getAppPath(),
        CONSCIENCE_BINARIES_PATH: binariesPath,
        PATH: binariesPath + ':' + process.env.PATH + ':/usr/local/bin:/usr/bin:/usr/sbin:/sbin',
    })
    return env
}

export default function spawnCmd(cmd: string, args: string[], cwd: string) {
    return new Promise<string>((resolve, reject) => {
        let stdout = '', stderr = ''
        let proc = spawn(cmd, args, { cwd, env: getEnv() })
        proc.stdout.on('data', (data: string) => { stdout += data })
        proc.stderr.on('data', (data: string) => { stderr += data })
        proc.on('close', (code: number) => {
            if (code !== 0) {
                return reject(new Error(stderr))
            }
            return resolve(stdout)
        })
    })
}
