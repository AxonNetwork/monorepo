import path from 'path'
import Datastore from 'nedb'
import bluebird from 'bluebird'
import { getRepoID } from 'conscience-components/env-specific'
import * as rpc from 'conscience-lib/rpc'
import { interpolateTimeline, getSecuredTextStats, getRepoMetadata } from 'conscience-lib/cacheHelpers'
import { LocalURI, IRepoMetadata, ITimelineEvent, ISecuredTextInfo } from 'conscience-lib/common'
const app = (window as any).require('electron').remote.app
const appPath = path.join(app.getPath('appData'), 'Conscience')

const metadataDB = new Datastore({ filename: path.join(appPath, 'metadata.db'), autoload: true })
const securedTextDB = new Datastore({ filename: path.join(appPath, 'secured-text.db'), autoload: true })
const commitDB = new Datastore({ filename: path.join(appPath, 'commit.db'), autoload: true })
const db = {
    metadata: bluebird.promisifyAll(metadataDB, { suffix: 'Async' }) as any,
    securedText: bluebird.promisifyAll(securedTextDB, { suffix: 'Async' }) as any,
    commits: bluebird.promisifyAll(commitDB, { suffix: 'Async' }) as any,
}
db.metadata.ensureIndexAsync({ fieldName: 'path', unique: true })
db.securedText.ensureIndexAsync({ fieldName: 'repoID' })
db.securedText.ensureIndexAsync({ fieldName: 'file' })
db.commits.ensureIndexAsync({ fieldName: 'commit', unique: true })

// schema = {

// }

const LocalCache = {

    // load metadata from cache or update if behind
    async loadMetadata(uri: LocalURI): Promise<IRepoMetadata> {
        await LocalCache.syncCache(uri)
        return db.metadata.findOneAsync({ path: uri.repoRoot })
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

        if (repoMetadata && repoMetadata.currentHead === commits[0].commitHash) {
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
        const oldHEAD = !!metadata ? metadata.oldHEAD : undefined
        const fromInitialCommit = oldHEAD === undefined

        const { commits = [] } = await rpc.getClient().getRepoHistoryAsync({ path, toCommit: oldHEAD })
        if (commits.length === 0) {
            return
        }
        const repoID = getRepoID(uri)
        const { events = [] } = await rpc.getClient().getUpdatedRefEventsAsync({ repoID })
        const refEventsList = events.reverse()

        const timeline = interpolateTimeline(repoID, commits, refEventsList)
        const filesByCommit = commits.map(c => c.files)
        const securedTextStats = getSecuredTextStats(repoID, timeline, filesByCommit, fromInitialCommit)

        console.log('timeline: ', timeline)
        console.log('securedTextStats: ', securedTextStats)
        const commitPromises = timeline.map(evt => db.commits.updateAsync({ commit: evt.commit }, evt, { upsert: true }))
        const securedPromises = securedTextStats.map(stat => db.securedText.updateAsync({ repoID: stat.repoID, file: stat.file }, stat, { upsert: true }))

        // add to cache before updating currentHEAD (cursor) in repo table
        await Promise.all([
            ...commitPromises,
            ...securedPromises,
        ])

        metadata = getRepoMetadata(repoID, timeline, refEventsList, fromInitialCommit)
        metadata.path = path
        await db.metadata.updateAsync({ path }, metadata, { upsert: true })
        console.log("SUCCESS")

    },

}

export default LocalCache