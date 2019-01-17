import events from 'events'
import * as rpc from 'conscience-lib/rpc'
const chokidar = (window as any).require('chokidar')

const watching: {
    [path: string]: {
        repoID: string,
        path: string,
        mtime: number,
        emitter: events.EventEmitter,
        watcher: any,
    },
} = {}

const RepoWatcher = {
    watch(repoID: string, path: string) {
        if (watching[path]) {
            return null
        }

        const emitter = new events.EventEmitter()
        const watcher = chokidar.watch(path, {
            persistent: true,
            ignoreInitial: true,
            ignored: [
                /\.git$/,
                /\/node_modules\b/,
            ],
        })

        watching[path] = {
            path,
            repoID,
            mtime: 0,
            emitter: emitter,
            watcher: watcher,
        }

        watcher.on('ready', () => {
            watcher.on('add', () => emitter.emit('file_change'))
            watcher.on('addDir', () => emitter.emit('file_change'))
            watcher.on('change', () => emitter.emit('file_change'))
            watcher.on('unlink', () => emitter.emit('file_change'))
            watcher.on('unlinkDir', () => emitter.emit('file_change'))
            watcher.on('error', (err: Error) => console.error('chokidar error:', err))
        })

        return emitter
    },

    unwatch(path: string) {
        const toDelete = watching[path]
        if (toDelete !== undefined) {
            toDelete.emitter.emit('end')
            toDelete.watcher.close()
        }
        delete watching[path]
    },
}

function loop() {
    const repos = Object.keys(watching)
    for (let i = 0; i < repos.length; i++) {
        const path = repos[i]
        // checkForChange(path)
        checkBehindRemote(path)
    }
    setTimeout(loop, 5000)
}

loop()

// function getMtimeRecurse(folder: string) {
//     const stat = fs.statSync(folder)
//     if (!stat.isDirectory) {
//         return stat.mtime.getTime()
//     }
//     let subfiles
//     try {
//         subfiles = fs.readdirSync(folder)
//         .map((name: string) => join(folder, name))
//     }catch (_) {
//         return stat.mtime.getTime()
//     }
//     if (subfiles.length === 0) {
//         return stat.mtime.getTime()
//     }
//     const mtimes = subfiles.map((path: string) => getMtimeRecurse(path))
//     const max = mtimes.reduce((a: number, b: number) => {
//         return Math.max(a, b)
//     })
//     return max
// }

// async function checkForChange(path: string) {
//     const repo = watching[path]
//     if (repo === undefined) {
//         return
//     }

//     const mtime = getMtimeRecurse(path)
//     if (mtime > repo.mtime && repo.mtime !== 0) {
//         repo.emitter.emit('file_change')
//     }
//     repo.mtime = mtime
//     watching[path] = repo
// }

async function checkBehindRemote(path: string) {
    const repo = watching[path]
    if (repo === undefined) {
        return
    }
    try {
        const res = await rpc.client.isBehindRemoteAsync({ repoID: repo.repoID, path: repo.path })
        const isBehind = res.isBehindRemote === true
        if (isBehind) {
            repo.emitter.emit('behind_remote')
        }
    } catch (err) {
        // no-op
    }
}


export default RepoWatcher