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

        checkBehindRemote(path)

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

async function loop() {
    const repos = Object.keys(watching)
    const fetches = repos.map(repoRoot => checkBehindRemote(repoRoot))
    await Promise.all(fetches)
    // @@TODO: configurable interval
    setTimeout(loop, 30000)
}

loop()

async function checkBehindRemote(path: string) {
    const repo = watching[path]
    if (repo === undefined) {
        return
    }
    try {
        const res = await rpc.getClient().isBehindRemoteAsync({ repoID: repo.repoID, path: repo.path })
        const isBehind = res.isBehindRemote === true
        if (isBehind) {
            repo.emitter.emit('behind_remote')
        }
    } catch (err) {
        // no-op
    }
}


export default RepoWatcher