const exec = require('child_process').exec
const Promise = require('bluebird')
const klaw = require('klaw')
const through2 = require('through2')
const path = require('path')
const mkdirp = require('mkdirp')
const git = require('isomorphic-git')
const fs = require('fs')
const fileType = require('./fileType')

git.plugins.set('fs', fs)

const repoMutex = {}

async function waitAndLock(folderPath) {
    return new Promise((resolve, reject) => {
        const wait = () => {
            if (isLocked(folderPath)) {
                setTimeout(wait, 100)
            } else {
                lock(folderPath)
                return resolve()
            }
        }
        wait()
    })
}

function lock(folderPath) {
    repoMutex[folderPath] = true
}
function unlock(folderPath) {
    repoMutex[folderPath] = false
}

function isLocked(folderPath) {
    return repoMutex[folderPath] !== undefined && repoMutex[folderPath]
}

async function getRepos() {
    const stdout = await execCmd('conscience repos')
    if (stdout.length === 0) { return [] }

    let repos = stdout.trim().split('\n')
    repos = repos.map((repo) => {
        const repoID = repo.split(' ')[0]
        return {
            repoID,
            folderPath: repo.split(' ')[1],
            name: repoID.split('/')[1],
            creator: repoID.split('/')[0],
        }
    })
    return repos
}

async function fetchRepo(repoID, folderPath) {
    const files = await getFiles(folderPath)
    const timeline = await getTimeline(folderPath)
    const behindRemote = await isBehindRemote(repoID, folderPath)
    return {
        repoID,
        folderPath,
        files,
        timeline,
        behindRemote,
    }
}

async function isBehindRemote(repoID, folderPath) {
    const remoteRefs = await execCmd(`conscience get-refs ${repoID}`)
    if (remoteRefs.length === 0) {
        return false
    }

    const masterRef = remoteRefs.split('\n').find(ref => ref.indexOf('refs/heads/master') > -1)
    const masterHash = masterRef.split(' ')[0]

    // if have commit local, return false
    try {
        await waitAndLock(folderPath)
        const obj = await git.readObject({ dir: folderPath, oid: masterHash })
        if (obj.type === 'commit') {
            unlock(folderPath)
            return false
        }
    } catch (err) {
        if (err.code === 'ReadObjectFail') {
            // No-op, this is expected to happen if we don't have the commit pointed to by the remote ref
        } else {
            // This is an unexpected error
            console.log('ERROR running ConscienceManager.isBehindRemote ~>', err)
        }
    }
    unlock(folderPath)
    return true
}

async function getFiles(folderPath) {
    let files = []
    return new Promise(async (resolve, reject) => {
        await waitAndLock(folderPath)

        klaw(folderPath, {
            // Filter certain paths entirely (we don't even walk these)
            filter: (item) => {
                const basename = path.basename(item)
                // @@TODO: don't hardcode these
                return basename !== 'node_modules' && basename !== '.git' && basename !== '.DS_Store'
            },

        }).pipe(through2.obj((item, enc, next) => {
            // Exclude directories
            if (!item.stats.isDirectory()) {
                next(null, item)
            } else {
                next()
            }
        })).pipe(through2.obj(async (item, enc, next) => {
            const relPath = path.relative(folderPath, item.path)

            let status
            try {
                status = await git.status({ dir: folderPath, filepath: relPath })
            } catch (err) {
                status = '*added'
            }

            let diff = ''
            if (status === '*modified') {
                try {
                    diff = await getDiff(folderPath, item.path)
                } catch (err) {}
            }

            next(null, {
                path: item.path,
                name: relPath,
                size: item.stats.size,
                modified: Date.parse(item.stats.mtime),
                type: fileType(item.path),
                status,
                diff,
            })
        })).on('data', (item) => {
            files.push(item)
        }).on('error', err => {
            console.log('error walking files ~>', err)
            reject(err)
        }).on('end', async () => {
            unlock(folderPath)

            // convert array to obj
            files = files.reduce((acc, cur) => {
                acc[cur.name] = cur
                return acc
            }, {})
            resolve(files)
        })
    })
}

async function getFilesFromTree(folderPath, oid, subfolder) {
    let tree
    try {
        tree = await git.readObject({ dir: folderPath, oid })
    } catch (err) {
        console.log('ERROR running ConscienceManager.getFilesFromTree ~>', err)
        return []
    }

    const subTrees = tree.object.entries.filter(f => f.type === 'tree')
    let files = tree.object.entries.filter(f => f.type === 'blob')
    const subFileArrays = await Promise.all(subTrees.map(t => getFilesFromTree(folderPath, t.oid, t.path)))
    for (let i = 0 i < subFileArrays.length i++) {
        files = files.concat(subFileArrays[i])
    }
    files = files.map((f) => {
        if (f.path !== undefined) {
            f.path = path.join(subfolder, f.path)
        }
        return f
    })
    return files
}

async function getTimeline(folderPath) {
    await waitAndLock(folderPath)
    let commits let
        filesByCommit
    try {
        commits = await git.log({ dir: folderPath })
        treeOids = commits.map(commit => commit.tree)
        filesByCommit = await Promise.all(treeOids.map(oid => getFilesFromTree(folderPath, oid, '')))
    } catch (err) {
        console.log('ERROR running ConscienceManager.getTimeline ~>', err)
        unlock(folderPath)
        return []
    }
    unlock(folderPath)

    const timeline = []
    for (let i = 0 i < commits.length i++) {
        const commit = commits[i]
        let files = filesByCommit[i].filter((f) => {
            if (i === commits.length - 1) { return true }
            const prev = filesByCommit[i + 1].find(f2 => f2.path === f.path)
            return prev === undefined || f.oid !== prev.oid
        })
        files = files.map(f => f.path)
        timeline.push({
            commit: commit.oid,
            version: commits.length - i,
            user: commit.author.name,
            files,
            time: commit.author.timestamp * 1000,
            message: commit.message,
        })
    }
    return timeline
}

async function checkpointRepo(folderPath, message) {
    await waitAndLock(folderPath)
    try {
        await execCmd('git add .', folderPath)
        await execCmd(`git commit -m "${message}"`, folderPath)
        // @@TODO: don't always push to origin — intelligently look for conscience:// remotes
        await execCmd('git push origin master', folderPath)
    } catch (err) {
        console.log('ERROR running ConscienceManager.checkpointRepo ~>', err)
    }

    const commits = await git.log({ dir: folderPath })
    unlock(folderPath)
    return commits.length
}

async function pullRepo(folderPath) {
    await waitAndLock(folderPath)
    try {
        await execCmd('git pull origin master', folderPath)
    } catch (err) {
        console.log('ERROR running ConscienceManager.pullRepo ~>', err)
        unlock(folderPath)
        throw err
    }
    unlock(folderPath)
    return true
}

async function execCmd(cmd, cwd) {
    return new Promise(async (resolve, reject) => {
        exec(cmd, { cwd }, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            } else {
                resolve(stdout)
            }
        })
    })
}

async function createRepo(repoID, location) {
    const folderPath = path.join(location, repoID)
    mkdirp(folderPath)
    try {
        await execCmd(`conscience init ${repoID}`, folderPath)
    } catch (err) {
        console.log('ERROR running ConscienceManager.createRepo ~>', err)
    }
    return {
        repoID,
        folderPath,
    }
}

async function cloneRepo(repoID, location) {
    try {
        await execCmd(`git clone conscience://${repoID}`, location)
    } catch (err) {
        console.log('ERROR running ConscienceManager.cloneRepo ~>', err)
    }
    let name = repoID
    if (repoID.indexOf('/') > -1) {
        name = repoID.split('/')[1]
    }
    return {
        repoID,
        folderPath: path.join(location, name),
    }
}

async function getDiff(folderPath, filename, commit) {
    const exists = fs.existsSync(path.join(folderPath, filename))
    if (!exists) {
        return (`Deleted: ${filename}`)
    }

    let cmd = 'git diff'
    if (commit !== undefined) { cmd += ` ${commit}` }
    if (filename !== undefined) { cmd += ` ${filename}` }

    let diff
    try {
        diff = await execCmd(cmd, folderPath)
    } catch (err) {
        console.log('ERROR running ConscienceManager.getDiff ~>', err)
    }
    return diff
}

async function revertFiles(folderPath, files, commit) {
    try {
        let fileList = ''
        for (let i = 0 i < files.length i++) {
            await execCmd(`git reset ${commit} ${files[i]}`, folderPath)
            await execCmd(`git checkout -- ${files[i]}`, folderPath)
            fileList += files[i]
            if (i === files.length - 2) { fileList += ' and ' }
            if (i < files.length - 2) { fileList += ', ' }
        }
        await execCmd(`git commit -m "Reset ${fileList} to past version"`, folderPath)
    } catch (err) {
        console.log('ERROR running ConscienceManager.revertFiles ~>', err)
        throw err
    }
    return true
}

module.exports = {
    getRepos,
    fetchRepo,
    isBehindRemote,
    pullRepo,
    getFiles,
    getTimeline,
    getTimelines,
    checkpointRepo,
    createRepo,
    cloneRepo,
    getDiff,
    revertFiles,
}
