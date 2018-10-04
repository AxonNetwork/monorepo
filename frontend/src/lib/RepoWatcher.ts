import events from 'events'
const fs = (window as any).require('fs')

const watching:{
    [path: string]:{
        repoID: string,
        path: string,
        mtime: number,
        emitter: events.EventEmitter
    }|undefined
} = {}

const RepoWatcher = {
    watch(repoID: string, path: string) {
        const emitter = new events.EventEmitter()
        watching[path] = {
            path,
            repoID,
            mtime: 0,
            emitter: emitter
        }
        return emitter
    },

    unwatch(path: string) {
        const toDelete = watching[path]
        if(toDelete !== undefined){
            toDelete.emitter.emit('end')
        }
        delete watching[path]
    }
}

function loop(){
    const repos = Object.keys(watching)
    for(let i=0; i<repos.length; i++){
        const path = repos[i]
        checkForChange(path)
        checkBehindRemote(path)
    }
    setTimeout(loop, 5000)
}

async function checkForChange(path: string){
    const repo = watching[path]
    if(repo === undefined){
        return
    }
    const mtime = fs.statSync(repo.path).mtimeMs
    if(mtime > repo.mtime && repo.mtime !== 0){
        repo.emitter.emit('file_change')
    }
    repo.mtime = mtime
    watching[path] = repo
}

async function checkBehindRemote(path: string){
    const repo = watching[path]
    if(repo === undefined){
        return
    }
    // const rpcClient = rpc.initClient()
    // const remote = await rpcClient.getRemoteRefsAsync({repoID: repo.repoID, pageSize: 10, page: 0})
    // const local = await rpcClient.getLocalRefsAsync({repoID: repo.repoID, path: repo.path})
    // const remoteMaster = remote.refs.find(r=>r.refName="refs/heads/master").commitHash
    // const localMaster = local.refs.find(r=>r.refName="refs/heads/master").commitHash
}

loop()

export default RepoWatcher