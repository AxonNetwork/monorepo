const fs = (window as any).require('fs')

const watching:{[path: string]:{repoID: string, path: string, mtime: number}|undefined} = {}

const RepoWatcher = {
    watch(repoID: string, path: string) {
        watching[path] = { path, repoID, mtime: 0 }
    },

    unwatch(path: string) {
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
        // TODO: Get new file
        // console.log(repo.path + " CHANGED")
        // try{
        //     const files = await rpcClient.getRepoFilesAsync({repoID: repo.repoID, path: repo.path})
        //     console.log("Files: ", files)
        // }catch(err){
        //     console.log(err)
        // }
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