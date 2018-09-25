import Promise from 'bluebird'
import events from 'events'
import fs from 'fs'
// const fs = window.require('fs')
const ipcRenderer = window.require('electron').ipcRenderer

console.log('including protobufs test')
require('../protobufs/test')

ipcRenderer.setMaxListeners(100)

async function sendMessage(message){
    return new Promise((resolve, reject) => {
        const messageId = Math.floor(Math.random()*1000000).toString(16)
        message.id = messageId
        ipcRenderer.send('message', message);
        const cb = (event, res)=>{
            let response = JSON.parse(res)
            if(response.id === messageId){
                ipcRenderer.removeListener('message', cb)
                resolve(response)
            }
        }
        ipcRenderer.on('message',cb)
    })
}

export async function getRepos(){
	const message = {
		type: 'GET_REPOS',
	}
	const response = await sendMessage(message)
	console.log('ConscienceManager.getRepos ~>', response)
	return response.repos
}

export async function fetchRepo(repoID, folderPath){
    const message = {
        type: 'FETCH_REPO',
        repoID: repoID,
        folderPath: folderPath
    }
	const response = await sendMessage(message)
    console.log('ConscienceManager.fetchRepo ~>', response)
    return response.repo
}

export async function checkpointRepo(folderPath, commitMessage){
    const message = {
        type: 'CHECKPOINT_REPO',
        folderPath: folderPath,
        commitMessage: commitMessage
    }
	const response = await sendMessage(message)
    console.log('ConscienceManager.checkpointRepo ~>', response)
    return response.version
}

export async function pullRepo(folderPath){
    const message = {
        type: 'PULL_REPO',
        folderPath: folderPath,
    }
	const response = await sendMessage(message)
    console.log('ConscienceManager.pullRepo ~>', response)
    return true
}

export async function getFiles(folderPath){
    const message = {
        type: 'GET_FILES',
        folderPath: folderPath
    }
	const response = await sendMessage(message)
	console.log('ConscienceManager.getFiles ~>', response)
	return response.files
}

export async function createRepo(repoID, location){
    const message = {
        type: 'CREATE_REPO',
        repoID: repoID,
        location: location,
    }
	const response = await sendMessage(message)
	console.log('ConscienceManager.createRepo ~>', response)
	return response.repo
}

export async function cloneRepo(repoID, location){
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
	return response.repo
}

export async function getDiff(folderPath, filename, commit){
    const message = {
        type: 'GET_DIFF',
        folderPath: folderPath,
        filename: filename,
        commit: commit
    }
	const response = await sendMessage(message)
	console.log('consciencemanager.getDiff ~>', response)
	return response.diff
}

export async function getTimeline(folderPath){
    const message = {
        type: 'GET_TIMELINE',
        folderPath: folderPath,
    }
	const response = await sendMessage(message)
	console.log('ConscienceManager.getTimeline~>', response)
	return response.timeline
}

export async function revertFiles(folderPath, files, commit){
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

export async function isBehindRemote(repoID, folderPath){
    const message = {
        type: 'IS_BEHIND_REMOTE',
        repoID: repoID,
        folderPath: folderPath,
    }
	const response = await sendMessage(message)
	// console.log('ConscienceManager.isBehindRemote ~>', response)
	return response.isBehind
}

function watchRepo(repoID, folderPath){
    const emitter = new events.EventEmitter()
    let lastMtime = fs.statSync(folderPath).mtimeMs
    const checkMTime = async ()=>{
        const mtime = fs.statSync(folderPath).mtimeMs
        if(mtime > lastMtime){
            const [files, timeline] = await Promise.all([
                getFiles(folderPath),
                getTimeline(folderPath)
            ])
            emitter.emit('file_change', files, timeline)
            lastMtime = mtime
        }
        setTimeout(checkMTime, 5000)
    }
    checkMTime()

    const checkBehindRemote = async()=>{
        const behind = await isBehindRemote(repoID, folderPath)
        if(behind){
            emitter.emit('behind_remote')
        }
        setTimeout(checkBehindRemote, 5000)
    }
    checkBehindRemote()

    return emitter
}

export default {
    getRepos,
    fetchRepo,
    checkpointRepo,
    pullRepo,
    getFiles,
    createRepo,
    cloneRepo,
    getDiff,
    getTimeline,
    revertFiles,
    watchRepo,
}