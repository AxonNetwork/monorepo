const { exec, spawn } = require('child_process')
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
    for (let i = 0; i < subFileArrays.length; i++) {
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

function spawnCmd(cmd, args, cwd) {
    return new Promise((resolve, reject) => {
        let stdout = '', stderr = ''
        let proc = spawn(cmd, args, { cwd })
        proc.stdout.on('data', (data) => {
            stdout += data
        })
        proc.stderr.on('data', (data) => {
            stderr += data
        })
        proc.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(stderr))
            }
            return resolve(stdout)
        })
    })
}

async function getDiff(repoRoot, commit) {
    let diff
    try {
        diff = await spawnCmd('git', ['show', commit], repoRoot)
    } catch (err) {
        console.log('ERROR running ConscienceManager.getDiff ~>', err)
        throw err
    }
    return diff
}

async function revertFiles(folderPath, files, commit) {
    try {
        let fileList = ''
        for (let i = 0; i < files.length; i++) {
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
    pullRepo,
    checkpointRepo,
    cloneRepo,
    getDiff,
    revertFiles,
}
