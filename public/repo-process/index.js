const { GET_REPOS, FETCH_REPO, CREATE_REPO, CLONE_REPO, CHECKPOINT_REPO, PULL_REPO, GET_FILES, GET_TIMELINE, GET_DIFF, REVERT_FILES, IS_BEHIND_REMOTE } = require('./lib/messageTypes')
const ConscienceManager = require('./lib/ConscienceManager')

process.on('message', async (message) => {
    const result = await processMessage(JSON.parse(message))
    process.send(result)
})

async function processMessage(message){
    switch (message.type) {
        case GET_REPOS:
            try{
                const repos = await ConscienceManager.getRepos()
                return {response: 'SUCCESS', id:message.id, repos: repos}
            }catch(err){return {response: 'ERROR', id:message.id, error: err}}
        case FETCH_REPO:
            try{
                const repo = await ConscienceManager.fetchRepo(message.repoID, message.folderPath)
                return {response: 'SUCCESS', id:message.id, repo: repo}
            }catch(err){return {response: 'ERROR', id:message.id, error: err}}
       case CLONE_REPO:
            try{
                const repo = await ConscienceManager.cloneRepo(message.repoID, message.location)
                return {response: 'SUCCESS', id:message.id, repo: repo}
            }catch(err){return {response: 'ERROR', id:message.id, error: err}}
        case CREATE_REPO:
            try{
                const repo = await ConscienceManager.createRepo(message.repoID, message.location, message.username)
                return {response: 'SUCCESS', id:message.id, repo: repo}
            }catch(err){return {response: 'ERROR', id:message.id, error: err}}
        case CHECKPOINT_REPO:
            try{
                const version = await ConscienceManager.checkpointRepo(message.folderPath, message.commitMessage)
                return {response: 'SUCCESS', id:message.id, version: version}
            }catch(err){return {response: 'ERROR', id:message.id, error: err}}
        case PULL_REPO:
            try{
                await ConscienceManager.pullRepo(message.folderPath)
                return {response: 'SUCCESS', id:message.id}
            }catch(err){return {response: 'ERROR', id:message.id, error: err}}
       case GET_FILES:
            try{
                const files = await ConscienceManager.getFiles(message.folderPath)
                return {response: 'SUCCESS', id:message.id, files: files}
            }catch(err){return {response: 'ERROR', id:message.id, error: err}}
       case GET_TIMELINE:
            try{
                const timeline = await ConscienceManager.getTimeline(message.folderPath)
                return {response: 'SUCCESS', id:message.id, timeline: timeline}
            }catch(err){return {response: 'ERROR', id:message.id, error: err}}
       case GET_DIFF:
            try{
                const diff = await ConscienceManager.getDiff(message.folderPath, message.filename, message.commit)
                return {response: 'SUCCESS', id:message.id, diff: diff}
            }catch(err){return {response: 'ERROR', id:message.id, error: err}}
        case REVERT_FILES:
            try{
                await ConscienceManager.revertFiles(message.folderPath, message.files, message.commit)
                return {response: 'SUCCESS', id:message.id}
            }catch(err){return {response: 'ERROR', id:message.id, error: err}}
        case IS_BEHIND_REMOTE:
            try{
                const isBehind = await ConscienceManager.isBehindRemote(message.repoID, message.folderPath)
                return {response: 'SUCCESS', id:message.id, isBehind: isBehind}
            }catch(err){return {response: 'ERROR', id:message.id, error: err}}

      default:
            return {
                response: 'INVALID_REQUEST'
            }
    }
}