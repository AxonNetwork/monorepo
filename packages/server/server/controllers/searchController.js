import path from 'path'
import { elasticsearch } from '../config/aws'
import { fileType } from '../util'
import * as noderpc from '../noderpc'

const searchController = {}

searchController.get = async (req, res, next) => {
    const { index, type, id } = req.query
    console.log('index', index, 'type', type, 'id', id)

    try {
        const resp = await elasticsearch.get({ index, type, id })
        res.json(resp)
    } catch(err) {
        console.log('error ~>', err.status)
        res.status(500).json({ error: err })
    }
}

searchController.search = async (req, res, next) => {
    async function searchFiles(query) {
        const resp = await elasticsearch.search({
            index:   'repo-files',
            _source: [ '_id', '_type', 'repoID', 'filename' ],
            body:    {
                query: {
                    // match: {
                    //     // filename: {
                    //     //     query,
                    //     //     operator: 'and',
                    //     // },
                    //     contents: {
                    //         query,
                    //         operator: 'and',
                    //     },
                    // },
                    simple_query_string: {
                        query,
                        fields:           [ 'filename', 'contents' ],
                        default_operator: 'or',
                    },
                },
                // facets:        { tags: { terms: { field: 'tags' } } },
            },
        })
        const hits = resp.hits.hits.map(x => ({
            repoID:   x._source.repoID,
            filename: x._source.filename,
            hash:     x._id,
        }))
        return hits
    }

    async function searchComments(query) {
        const resp = await elasticsearch.search({
            index:   'comments',
            _source: [ '_id', '_type', 'repoID', 'discussionID' ],
            body:    {
                query: {
                    simple_query_string: {
                        query,
                        fields:           [ 'text' ],
                        default_operator: 'or',
                    },
                },
            },
        })
        const hits = resp.hits.hits.map(x => ({
            commentID:    x._id,
            repoID:       x._source.repoID,
            discussionID: x._source.discussionID,
        }))
        return hits
    }

    async function searchUsers(query) {
        const resp = await elasticsearch.search({
            index:   'users',
            _source: [ '_id', '_type' ],
            body:    {
                query: {
                    simple_query_string: {
                        query,
                        fields:           [ 'username', 'name', 'bio', 'geolocation', 'orcid', 'university', 'interests' ],
                        default_operator: 'or',
                    },
                },
            },
        })
        const hits = resp.hits.hits.map(x => ({
            userID: x._id,
        }))
        return hits
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
    const query = req.query.q

    const respFiles = await searchFiles(query)
    const respComments = await searchComments(query)
    const respUsers = await searchUsers(query)

    res.json({
        comments: respComments,
        files:    respFiles,
        users:    respUsers,
    })
}

searchController.refresh = async (req, res, next) => {
    const { index } = req.query
    await elasticsearch.indices.refresh({ index })
    res.json({})
}

searchController.reindexRepo = async (req, res, next) => {
    function collectRPCObjectStream(stream) {
        return new Promise((resolve, reject) => {
            let gotHeader = false
            let totalSize = 0
            const buffers = []

            stream.on('data', (pkt) => {
                if (!gotHeader && pkt.header) {
                    totalSize = pkt.header.uncompressedSize.toNumber()
                    gotHeader = true
                } else if (pkt.data.end) {
                    const contents = Buffer.concat(buffers, totalSize)
                    resolve(contents)
                } else {
                    buffers.push(pkt.data.data)
                }
            })

            stream.on('error', (err) => {
                console.error(`rpc.GetObject( ${repoRoot}, ${commit}, ${filename} ): ${err.toString()}`)
                reject(err)
            })
        })
    }

    async function reindexFiles(repoID) {
        const rpcClient = noderpc.initClient()
        const filesListRaw = (await rpcClient.getRepoFilesAsync({ repoID })).files || []

        for (const file of filesListRaw) {
            // skip files over 1mb
            // @@TODO: make this configurable
            if (!file.size || file.size.toNumber() > 1024 * 1024) {
                console.log('skipping', file.name, ': too large')
                continue
            }

            // skip files that aren't text
            if ([ 'data', 'code', 'text' ].indexOf(fileType(file.name)) === -1) {
                console.log('skipping', file.name, ': not text')
                continue
            }

            // skip files that haven't been committed
            if (!file.hash) {
                continue
            }

            // @@TODO: use maxSize to prevent indexing massive files
            const contentsStream = await rpcClient.getObject({ repoID, commitRef: 'HEAD', filename: file.name, maxSize: 999999999 })
            const contents = await collectRPCObjectStream(contentsStream)

            await elasticsearch.index({
                index: 'repo-files',
                type:  'file',
                id:    file.hash.toString('hex'),
                body:  {
                    repoID,
                    filename: file.name,
                    contents: contents.toString('utf8'),
                },
                // opType: 'create', // this tells ES to create the document if absent
            })
        }

        // Tell ES to refresh its index
        await elasticsearch.indices.refresh({ index: 'repo-files' })
    }

    const { repoID } = req.query
    if (!repoID) {
        throw new HTTPError(400, 'Missing repoID')
    }

    await reindexFiles(repoID)

    res.json({})
}


export default searchController
