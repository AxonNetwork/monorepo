import Repo from '../models/repo'
import Commit from '../models/commit'
import SecuredText from '../models/securedText'
import * as noderpc from '../noderpc'
import keyBy from 'lodash/keyBy'
import path from 'path'

export const addRepoToCache = async function (repoID) {
    const rpcClient = noderpc.initClient()
    const refEventsRev = (await rpcClient.getUpdatedRefEventsAsync({ repoID })).events || []
    const refEventsList = refEventsRev.reverse()
    await updateRepoInCache(repoID, refEventsList, undefined)
}

export const updateRepoInCache = async function (repoID, refEventsList, oldHEAD) {
    const rpcClient = noderpc.initClient()
    const { commits = [] } = await rpcClient.getRepoHistoryAsync({ repoID, toCommit: oldHEAD })
    const timeline = interpolateTimeline(repoID, commits, refEventsList)
    const fromInitialCommit = oldHEAD === undefined
    if (fromInitialCommit) {
        timeline[timeline.length - 1].isInitialCommit = true
    }

    const filesByCommit = commits.map(c => c.files)
    const securedTextStats = getSecuredTextStats(repoID, timeline, filesByCommit, fromInitialCommit)

    // if repo already exists, don't update firstEvent
    const firstEvent = fromInitialCommit ? refEventsList[refEventsList.length - 1] : undefined

    const cachePromises = [
	    Repo.updateCacheFields(repoID, timeline[0].commit, refEventsList[0], firstEvent),
	    Commit.addCommits(timeline),
	    SecuredText.addFiles(Object.values(securedTextStats)),
    ]

    await Promise.all(cachePromises)
}

const interpolateTimeline = function (repoID, commits, refEventsList) {
    const timeline = []
    let evtIndex = -1
    let refEvent = {}
    for (let i = 0; i < commits.length; i++) {
        const commit = commits[i]
        if (evtIndex + 1 < refEventsList.length - 1 && commit.commitHash === refEventsList[evtIndex + 1].commit) {
            evtIndex++
            refEvent = refEventsList[evtIndex]
        }
        timeline.push({
        	repoID,
            commit:             commit.commitHash,
            user:               commit.author,
            time:               commit.timestamp.toNumber() * 1000,
            message:            commit.message,
            lastVerifiedCommit: refEvent.commit,
            lastVerifiedTime:   refEvent.time !== undefined ? refEvent.time.toNumber() * 1000 : undefined,
        })
    }

    return timeline
}

// stats = {
//  repoID: string
// 	file: string
// 	lastModifiedCommit: number
// 	lastModifiedTime: number
// 	firstVerifiedCommit: number
// 	firstVerifiedTime: number
// 	lastVerifiedCommit: number
// 	lastVerifiedTime: number
// }
const getSecuredTextStats = function (repoID, timeline, filesByCommit, fromInitialCommit) {
    const stats = {}
    for (let i = 0; i < timeline.length; i++) {
        const event = timeline[i]
        const files = filesByCommit[i]
        files.forEach((file) => {
            if (stats[file] === undefined) {
                stats[file] = { repoID, file }
            }
            if (stats[file].lastModifiedTime === undefined) {
                stats[file].lastModifiedCommit = event.commit
                stats[file].lastModifiedTime = event.time
            }
            if (stats[file].lastVerifiedTime === undefined && event.lastVerifiedTime) {
                stats[file].lastVerifiedCommit = event.lastVerifiedCommit
                stats[file].lastVerifiedTime = event.lastVerifiedTime
            }
            if (fromInitialCommit) {
                stats[file].firstVerifiedCommit = event.lastVerifiedCommit
                stats[file].firstVerifiedTime = event.lastVerifiedTime
            }
        })
    }
    return stats
}
