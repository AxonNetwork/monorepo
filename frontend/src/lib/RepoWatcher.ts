const fs = (window as any).require('fs')

import * as rpc from '../rpc'

const rpcClient = rpc.initClient()
console.log(rpcClient)
const watching:{[folderPath: string]:{repoID: string, folderPath: string, mtime: number}|undefined} = {}

const RepoWatcher = {
    watch(repoID: string, folderPath: string) {
        watching[folderPath]={ folderPath, repoID, mtime: 0}
    },

    unwatch(folderPath: string){
        watching[folderPath] = undefined
    }
}

function loop(){
    const repos = Object.keys(watching)
    for(let i=0; i<repos.length; i++){
        const folderPath = repos[i]
        checkForChange(folderPath)
        checkBehindRemote(folderPath)
    }
    setTimeout(loop, 5000)
}

async function checkForChange(folderPath: string){
        const repo = watching[folderPath]
        if(repo === undefined){
            return
        }
        const mtime = fs.statSync(repo.folderPath).mtimeMs
        if(mtime > repo.mtime && repo.mtime !== 0){
            // TODO: Get new file
            console.log(repo.folderPath + " CHANGED")
            try{
                const files = await rpcClient.getRepoFilesAsync({repoID: repo.repoID, path: repo.folderPath})
                console.log("Files: ", files)
            }catch(err){
                console.log(err)
            }
        }
        repo.mtime = mtime
        watching[folderPath] = repo
}

function checkBehindRemote(folderPath: string){

}

loop()

export default RepoWatcher