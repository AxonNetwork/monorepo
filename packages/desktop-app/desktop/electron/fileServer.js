const memoize = require('lodash/memoize')
const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime-types')
const rpc = require('conscience-lib/rpc')
const through2 = require('through2')

const appPath = require('electron').app.getAppPath()

process.env.NODE_RPC = '0.0.0.0:1338'
const protoPath = process.env.NODE_ENV === 'development'
    ? path.join(appPath, '..', 'conscience-lib', 'rpc', 'noderpc.proto')
    : path.join(appPath, '..', 'desktop', 'dist-bundle', 'prod', 'noderpc.proto')

rpc.initClient(protoPath)

const reposByHash = {}
const crypto = require('crypto')

const getHash = memoize((input) => {
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
})

async function getRepoForHash(repoHash) {
    if (reposByHash[repoHash]) {
        return reposByHash[repoHash]
    }

    let local
    try {
        local = await rpc.getClient().getLocalReposAsync({})
    } catch (err) {
        console.error(err)
    }
    for (let i = 0; i < local.length; i++) {
        const repo = local[i]
        const hash = getHash(repo.path)
        reposByHash[hash] = repo.path
    }

    return reposByHash[repoHash]
}

function start() {
    http.createServer(async (req, res) => {
        const q = req.url
        const repoIndex = q.indexOf('/repo/')
        const commitIndex = q.indexOf('/file/', repoIndex + 6)
        const fileIndex = q.indexOf('/', commitIndex + 6)
        const repoHash = q.substring(repoIndex + 6, commitIndex)
        const commit = q.substring(commitIndex + 6, fileIndex)
        let filename = decodeURI(q.substring(fileIndex + 1))

    	if (!repoHash || !commit || !filename) {
    		res.writeHead(400)
    		return res.end('must include repoRoot, commit, and filename as params')
    	}
        const repoRoot = await getRepoForHash(repoHash)

        filename = filename.split('/').join(path.sep)

        const client = rpc.getClient()

        let stream
        if (commit === 'HEAD' || commit === 'working') {
            stream = client.getObject({ repoRoot, commitRef: commit, filename, maxSize: 999999999999999 })
        } else {
            if (commit.length != 40) {
                res.writeHead(400)
                return res.end('bad commit')
            }
            stream = client.getObject({ repoRoot, commitHash: Buffer.from(commit, 'hex'), filename, maxSize: 999999999999999 })
        }

        stream.on('error', (err) => {
            console.error(`error sending object ${filename}: ${err.toString()}`)
            res.writeHead(404)
            return res.end(`error sending object ${repoRoot} : ${commit} : ${filename}`)
        })

        const contentType = mime.lookup(filename)
        res.setHeader('Content-Type', contentType)

        stream.pipe(through2({ objectMode: true }, (chunk, enc, cb) => {
            const pkt = chunk.data
            if (!pkt) {
                return cb()
            }
            if (pkt.end) {
                return cb()
            }
            return cb(null, pkt.data)
        })).pipe(res)
    }).listen(3333)
}

module.exports = { start }
