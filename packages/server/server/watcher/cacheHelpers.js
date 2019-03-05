
export const interpolateTimeline = function (repoID, commits, refEventsList) {
    const timeline = []
    let evtIndex = -1
    let refEvent = {}
    let found = false
    // find first UpdatedRefEvent for timeline
    for (let i = 0; i < commits.length; i++) {
        for (let j = 0; j < refEventsList.length; j++) {
            if (commits[i].commitHash === refEventsList[j].commit) {
                evtIndex = j - 1
                refEvent = j - 1 >= 0 ? refEventsList[j - 1] : {}
                found = true
                break
            }
        }
        if (found) {
            break
        }
    }

    // combine timelines
    for (let i = 0; i < commits.length; i++) {
        const commit = commits[i]
        if (evtIndex + 1 < refEventsList.length && commit.commitHash === refEventsList[evtIndex + 1].commit) {
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

export const getSecuredTextStats = function (repoID, timeline, filesByCommit, currentStats, fromInitialCommit) {
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
    return Object.values(stats)
}

export const getRepoMetadata = function (repoID, timeline, refEventsList, fromInitialCommit) {
    const metadata = {
        repoID,
        currentHEAD:        timeline[0].commit,
        lastBlockNumber:    refEventsList[0].blockNumber.toNumber(),
        lastVerifiedCommit: refEventsList[0].commit,
        lastVerifiedTime:   refEventsList[0].time.toNumber(),
    }
    if (fromInitialCommit) {
        const firstEvent = refEventsList[refEventsList.length - 1]
        metadata.firstVerifiedCommit = firstEvent.commit
        metadata.firstVerifiedTime = firstEvent.time
    }
    return metadata
}
