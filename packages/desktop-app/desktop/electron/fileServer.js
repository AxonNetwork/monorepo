const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime-types')
const rpc = require('conscience-lib/rpc')
const through2 = require('through2')

const appPath = require('electron').app.getAppPath()

const protoPath = path.join(appPath, process.env.PROTO_PATH || '')
rpc.initClient(protoPath)

const reposByHash = {}
const crypto = require('crypto')

function getHash(input) {
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
}

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
        const filename = decodeURI(q.substring(fileIndex + 1))

    	if (!repoHash || !commit || !filename) {
    		res.writeHead(400)
    		return res.end('must include repoRoot, commit, and filename as params')
    	}
        const repoRoot = await getRepoForHash(repoHash)

        const client = rpc.getClient()

        let stream
        if (commit === 'HEAD') {
            stream = client.getObject({ repoRoot, commitRef: commit, filename, maxSize: 999999999999999 })
        } else {
            if (commit.length != 40) {
                res.writeHead(400)
                return res.end('bad commit')
            }
            stream = client.getObject({ repoRoot, commitHash: commit, filename, maxSize: 999999999999999 })
        }

        stream.on('error', (err) => {
            console.error(`error sending object ${filename}: ${err.toString()}`)
            res.writeHead(404)
            return res.end()
        })

        const contentType = mime.lookup(filename)
        res.setHeader('Content-Type', contentType)

        let gotHeader = false
        let totalSize = 0

        stream.pipe(through2({ objectMode: true }, (chunk, enc, cb) => {
            if (!gotHeader) {
                totalSize = chunk.header.uncompressedSize.toNumber()
                gotHeader = true
                return cb()
            }

            const pkt = chunk.data
            if (pkt.end) {
                return cb()
            }
            return cb(null, pkt.data)
        })).pipe(res)
    }).listen(3333)
}

module.exports = { start }
