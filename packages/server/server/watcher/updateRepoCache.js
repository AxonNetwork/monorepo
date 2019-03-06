import Repo from '../models/repo'
import Commit from '../models/commit'
import SecuredText from '../models/securedText'
import * as noderpc from '../noderpc'
import path from 'path'
import uniq from 'lodash/uniq'
import flatten from 'lodash/flatten'
import keyBy from 'lodash/keyBy'
import { interpolateTimeline, getSecuredTextStats, getRepoMetadata } from 'conscience-lib/cacheHelpers'

export const updateRepoCache = async function (repoID) {
    const rpcClient = noderpc.initClient()
    let repo = {}
    try {
        repo = await Repo.get(repoID)
    } catch (err) {} // expected: just means repo doesn't exist yet
    const currentHEAD = (repo.currentHEAD || '').length > 0 ? repo.currentHEAD : undefined
    const startBlock = repo.lastBlockNumber
    const fromInitialCommit = currentHEAD === undefined

    const pageSize = fromInitialCommit ? 50 : 10
    const fromCommitRef = 'HEAD'
    const { commits = [] } = await rpcClient.getHistoryUpToCommit({ path, fromCommitRef, pageSize, toCommit: currentHEAD })
    if (commits.length === 0) {
        return
    }

    const { events = [] } = await rpcClient.getUpdatedRefEventsAsync({ repoID, startBlock })
    const refEventsList = events.reverse()

    const timeline = interpolateTimeline(repoID, commits, refEventsList)
    const filesByCommit = commits.map(c => c.files)

    let currentStats = {}
    if (!fromInitialCommit) {
        const allFiles = uniq(flatten(filesByCommit))
        const stats = await SecuredText.getFilesForRepo(repoID, allFiles)
        currentStats = keyBy(stats, 'file')
    }
    const securedTextStats = getSecuredTextStats(repoID, timeline, filesByCommit, currentStats, fromInitialCommit)

    // add to cache before updating currentHEAD (cursor) in repo table
    await Promise.all([
        Commit.addCommits(timeline),
        SecuredText.addFiles(Object.values(securedTextStats)),
    ])

    // if repo already exists, don't update firstEvent
    const metadata = getRepoMetadata(repoID, timeline, refEventsList, repo, fromInitialCommit)
    await Repo.updateCacheFields(metadata)
}
