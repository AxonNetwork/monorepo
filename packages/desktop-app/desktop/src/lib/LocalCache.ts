import path from 'path'
import Datastore from 'nedb'
import bluebird from 'bluebird'
import { getRepoID } from 'conscience-components/env-specific'
import * as rpc from 'conscience-lib/rpc'
import { interpolateTimeline, getSecuredTextStats, getRepoMetadata } from 'conscience-lib/cacheHelpers'
import { LocalURI, IRepoMetadata, ITimelineEvent, ISecuredTextInfo } from 'conscience-lib/common'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import keyBy from 'lodash/keyBy'
const app = (window as any).require('electron').remote.app
const appPath = path.join(app.getPath('appData'), 'Axon')

const metadataDB = new Datastore({ filename: path.join(appPath, 'metadata.db'), autoload: true })
const securedTextDB = new Datastore({ filename: path.join(appPath, 'secured-text.db'), autoload: true })
const commitDB = new Datastore({ filename: path.join(appPath, 'commit.db'), autoload: true })
const db = {
    metadata: bluebird.promisifyAll(metadataDB, { suffix: 'Async' }) as any,
    securedText: bluebird.promisifyAll(securedTextDB, { suffix: 'Async' }) as any,
    commits: bluebird.promisifyAll(commitDB, { suffix: 'Async' }) as any,
}
db.metadata.ensureIndex({ fieldName: 'path' })
db.securedText.ensureIndex({ fieldName: 'repoID' })
db.securedText.ensureIndex({ fieldName: 'file' })
db.commits.ensureIndex({ fieldName: 'commit' })

const LocalCache = {

    // load metadata from cache or update if behind
    async loadMetadata(uri: LocalURI): Promise<IRepoMetadata> {
        await LocalCache.syncCache(uri)
        let x = db.metadata.findOneAsync({ path: uri.repoRoot })
        console.log('LocalCache', uri, x)
        return x
    },

    async loadSecuredFileInfo(uri: LocalURI): Promise<ISecuredTextInfo> {
        await LocalCache.syncCache(uri)
        const repoID = getRepoID(uri)
        const file = uri.filename
        return db.securedText.findOneAsync({ repoID, file })
    },

    async loadCommits(uri: LocalURI, commits: string[]): Promise<ITimelineEvent[]> {
        await LocalCache.syncCache(uri)
        const promises = commits.map(commit => db.commits.findOneAsync({ commit }))
        return Promise.all(promises)
    },

    async wipe() {
        const removed = await Promise.all([
            db.metadata.removeAsync({}, { multi: true }),
            db.commits.removeAsync({}, { multi: true }),
            db.securedText.removeAsync({}, { multi: true }),
        ])
        const totalDeleted = removed.reduce((acc, curr) => curr + acc, 0)
        console.log(`LocalCache: deleted ${totalDeleted} items out of the cache`)
    },

    async isRepoCurrent(uri: LocalURI): Promise<boolean> {
        const path = uri.repoRoot
        const { commits = [] } = await rpc.getClient().getRepoHistoryAsync({ path, pageSize: 1, onlyHashes: true })
        if (commits.length === 0) {
            return true
        }

        // if most recent is in cache, return
        const repoMetadata = await db.metadata.findOneAsync({ path })

        if (repoMetadata && repoMetadata.currentHEAD === commits[0].commitHash) {
            return true
        }
        return false
    },

    async syncCache(uri: LocalURI) {
        const isCurrent = await LocalCache.isRepoCurrent(uri)
        if (isCurrent) {
            return
        }
        const path = uri.repoRoot
        let metadata = db.metadata.findOneAsync({ path })
        const currentHEAD = (metadata || {}).currentHEAD
        const startBlock = (metadata || {}).lastBlockNumber
        const fromInitialCommit = currentHEAD === undefined

        const pageSize = fromInitialCommit ? 50 : 10
        const fromCommitRef = "HEAD"
        let { commits = [] } = await rpc.getClient().getHistoryUpToCommit({ path, fromCommitRef, pageSize, toCommit: currentHEAD })
        if (commits.length === 0) {
            return
        }

        const repoID = getRepoID(uri)
        const { events = [] } = await rpc.getClient().getUpdatedRefEventsAsync({ repoID, startBlock })
        const refEventsList = events.reverse()

        const timeline = interpolateTimeline(repoID, commits, refEventsList)
        const filesByCommit = commits.map(c => c.files)

        let currentStats = {}
        if (!fromInitialCommit) {
            const allFiles = uniq(flatten(filesByCommit)).map(f => { file: f })
            const stats = db.securedText.findAsync({ $and: [{ repoID }, { $or: allFiles }] })
            currentStats = keyBy(stats, 'file')
        }
        const securedTextStats = getSecuredTextStats(repoID, timeline, filesByCommit, currentStats, fromInitialCommit)

        const removeTimelineOr = timeline.map(evt => ({ commit: evt.commit }))
        const removeSecuredOr = securedTextStats.map(stat => ({ repoID: stat.repoID, file: stat.file }))
        const resp = await Promise.all([
            await db.commits.removeAsync({ $or: removeTimelineOr }, { multi: true }),
            await db.securedText.removeAsync({ $or: removeSecuredOr }, { multi: true }),
            await db.commits.insertAsync(timeline),
            await db.securedText.insertAsync(securedTextStats),
        ])

        // if large change, compact datafile
        const numDeleted = resp[0] + resp[2]
        const numAdded = timeline.length + securedTextStats.length
        if (numDeleted + numAdded > 100) {
            db.commits.persistence.compactDatafile()
            db.securedText.persistence.compactDatafile()
        }

        metadata = getRepoMetadata(repoID, timeline, refEventsList, metadata, fromInitialCommit)
        metadata.path = path
        await db.metadata.updateAsync({ path }, metadata, { upsert: true })
    },

}

export default LocalCache