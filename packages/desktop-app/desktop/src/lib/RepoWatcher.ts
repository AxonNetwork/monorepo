import events from 'events'
import * as rpc from 'conscience-lib/rpc'
const chokidar = (window as any).require('chokidar')

const watching: {
    [path: string]: {
        repoID: string,
        path: string,
        emitter: events.EventEmitter,
        fileWatcher: events.EventEmitter,
    },
} = {}

let nodeWatchStream: events.EventEmitter

const RepoWatcher = {

    watchNode() {
        const rpcClient = rpc.getClient()

        nodeWatchStream = rpcClient.watch({
            eventTypes: [
                rpcClient.EventType.PULLED_REPO,
                rpcClient.EventType.UPDATED_REF,
            ]
        })

        const emitter = new events.EventEmitter()

        nodeWatchStream.on('data', (evt) => {
            // forward repo-specific events to relevant repo watchers
            // forward node events to node watcher
            if (evt.addedRepoEvent) {
                emitter.emit('added_repo', evt)
            } else if (evt.pulledRepoEvent) {
                if ((watching[evt.pulledRepoEvent.repoRoot || ''] || {}).emitter) {
                    watching[evt.pulledRepoEvent.repoRoot].emitter.emit('pulled_repo', evt.pulledRepoEvent)
                }
            } else if (evt.updatedRefEvent) {
                const paths = Object.keys(watching)
                for (let i = 0; i < paths.length; i++) {
                    if (watching[paths[i]].repoID === evt.updatedRefEvent.repoID) {
                        watching[paths[i]].emitter.emit('updated_ref', evt.updatedRefEvent)
                    }
                }
            }
        })
        nodeWatchStream.on('error', (err) => {
            emitter.emit('error', err)
        })
        nodeWatchStream.on('end', () => {
            emitter.emit('end')
        })

        return emitter
    },

    watch(repoID: string, path: string) {
        if (watching[path]) {
            return null
        }

        const emitter = new events.EventEmitter()

        // watch file stystem
        const fileWatcher = chokidar.watch(path, {
            persistent: true,
            ignoreInitial: true,
            ignored: [
                /\.git$/,
                /\/node_modules\b/,
            ],
        })

        fileWatcher.on('ready', () => {
            fileWatcher.on('add', () => emitter.emit('file_change'))
            fileWatcher.on('addDir', () => emitter.emit('file_change'))
            fileWatcher.on('change', () => emitter.emit('file_change'))
            fileWatcher.on('unlink', () => emitter.emit('file_change'))
            fileWatcher.on('unlinkDir', () => emitter.emit('file_change'))
            fileWatcher.on('error', (err: Error) => console.error('chokidar error:', err))
        })

        watching[path] = {
            path,
            repoID,
            emitter: emitter,
            fileWatcher: fileWatcher,
        }

        return emitter
    },

    unwatch(path: string) {
        const toDelete = watching[path]
        if (toDelete !== undefined) {
            toDelete.emitter.emit('end')
            toDelete.fileWatcher.removeAllListeners()
        }
        delete watching[path]
    },
}

export default RepoWatcher