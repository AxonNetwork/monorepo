const {
    CLONE_REPO, CHECKPOINT_REPO, PULL_REPO, GET_DIFF, REVERT_FILES,
} = require('./lib/messageTypes');
const ConscienceManager = require('./lib/ConscienceManager');

process.on('message', async (message) => {
    const result = await processMessage(JSON.parse(message));
    process.send(result);
});

async function processMessage(message) {
    switch (message.type) {
    case CLONE_REPO:
        try {
            const repo = await ConscienceManager.cloneRepo(message.repoID, message.location);
            return { response: 'SUCCESS', id: message.id, repo };
        } catch (err) { return { response: 'ERROR', id: message.id, error: err }; }
    case CHECKPOINT_REPO:
        try {
            const version = await ConscienceManager.checkpointRepo(message.folderPath, message.commitMessage);
            return { response: 'SUCCESS', id: message.id, version };
        } catch (err) { return { response: 'ERROR', id: message.id, error: err }; }
    case PULL_REPO:
        try {
            await ConscienceManager.pullRepo(message.folderPath);
            return { response: 'SUCCESS', id: message.id };
        } catch (err) { return { response: 'ERROR', id: message.id, error: err }; }
    case GET_DIFF:
        try {
            const diff = await ConscienceManager.getDiff(message.repoRoot, message.commit);
            return { response: 'SUCCESS', id: message.id, diff };
        } catch (err) { return { response: 'ERROR', id: message.id, error: err.toString() }; }
    case REVERT_FILES:
        try {
            await ConscienceManager.revertFiles(message.folderPath, message.files, message.commit);
            return { response: 'SUCCESS', id: message.id };
        } catch (err) { return { response: 'ERROR', id: message.id, error: err }; }

    default:
        return {
            response: 'INVALID_REQUEST',
        };
    }
}
