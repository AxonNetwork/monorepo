const Promise = require('bluebird');
const ConscienceManager = require('./ConscienceManager');

async function stall() {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 100000);
    });
}

(async function () {
    const folderPath = '/Users/daniel/Documents/Conscience/testing';
    const repoID = 'daniel/testing';
    // await ConscienceManager.createRepo("test", "/Users/daniel/Documents/Conscience", "daniel")
    // const timeline = await ConscienceManager.getTimelines("/Users/daniel/Projects/conscience/protocol/testzone/another")
    // console.log(timeline)
    // let repo = await ConscienceManager.fetchRepo("daniel/test", "/Users/daniel/Documents/Conscience/test")
    // console.log(repo)
    // const files = await ConscienceManager.getFiles("/Users/daniel/Documents/Conscience/protocol-copy")
    // console.log(files)

    // const canPull = await ConscienceManager.isBehindRemote("daniel/skrt", "/Users/daniel/Documents/Conscience/skrt")
    // console.log(canPull)

    // const success = await ConscienceManager.pullRepo("'git reset ' + commit + ' ' + filename")
    // console.log(success)
    const timeline = await ConscienceManager.getTimeline(folderPath);
    //    console.log(timeline)

    // await ConscienceManager.checkpointRepo("/Users/daniel/Projects/conscience/protocol/testzone/another", "asdf")
    // const repos = await ConscienceManager.getRepos()
    // console.log(repos)
    // await ConscienceManager.cloneRepo("daniel/repo", "/Users/daniel/Documents/Conscience")
    // const diff = await ConscienceManager.getDiff("/Users/daniel/Documents/Conscience/skrt", "test.txt", "fd915fe3c9b61abdc32ca388086ecbd82c42358e")
    // console.log(diff)
    // await ConscienceManager.revertFiles('/Users/daniel/Documents/Conscience/skrt', ['test.txt', 'new.txt'], 'f72e9f1598924891477c53c24363b673fd28f801')
}());
