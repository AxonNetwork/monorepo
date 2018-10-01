// const fs = window.require('fs')
const ipcRenderer = window.require('electron').ipcRenderer

// console.log('including protobufs test')
// require('../protobufs/test')

ipcRenderer.setMaxListeners(100)

async function sendMessage(message: any) {
    return new Promise<any>((resolve) => {
        const messageId = Math.floor(Math.random()*1000000).toString(16)
        message.id = messageId
        ipcRenderer.send('message', message);
        const cb = (_: any, res: string) => {
            let response = JSON.parse(res)
            if(response.id === messageId){
                ipcRenderer.removeListener('message', cb)
                resolve(response)
            }
        }
        ipcRenderer.on('message', cb)
    })
}

export async function checkpointRepo(folderPath: string, commitMessage: string) {
    const message = {
        type: 'CHECKPOINT_REPO',
        folderPath: folderPath,
        commitMessage: commitMessage
    }
	const response = await sendMessage(message)
    console.log('ConscienceManager.checkpointRepo ~>', response)
    return response.version as number
}

export async function pullRepo(folderPath: string) {
    const message = {
        type: 'PULL_REPO',
        folderPath: folderPath,
    }
	const response = await sendMessage(message)
    console.log('ConscienceManager.pullRepo ~>', response)
    return true
}

export async function cloneRepo(repoID: string, location: string) {
    const message = {
        type: 'CLONE_REPO',
        repoID: repoID,
        location: location,
    }
	const response = await sendMessage(message)
    console.log('consciencemanager.cloneRepo ~>', response)
    if(response.response === "ERROR"){
        throw Error(response.error)
    }
	return response.repo as { repoID: string, folderPath: string }
}

export async function getDiff(repoRoot: string, commit: string) {
    const message = {
        type: 'GET_DIFF',
        repoRoot: repoRoot,
        commit: commit,
    }
	const response = await sendMessage(message)
	console.log('consciencemanager.getDiff ~>', response)
	return response.diff as string
}

export async function revertFiles(folderPath: string, files: string, commit: string) {
    const message = {
        type: 'REVERT_FILES',
        folderPath: folderPath,
        files: files,
        commit: commit
    }
	const response = await sendMessage(message)
	console.log('ConscienceManager.revertFiles ~>', response)
	return true
}

export default {
    checkpointRepo,
    pullRepo,
    cloneRepo,
    getDiff,
    revertFiles,
}