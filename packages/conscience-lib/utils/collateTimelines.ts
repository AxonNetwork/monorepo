import { ITimelineEvent } from 'conscience-lib/common'
import { getConscienceURI } from 'conscience-lib/utils'

export default function mergeTimelines(
    orgRepoIDList: string[],
    commitListsByURI: { [uri: string]: string[] },
    commits: { [commitHash: string]: ITimelineEvent }
) {
    let merged = [] as string[]

    let currentIndex = {} as { [repoID: string]: number }
    for (let repoID of orgRepoIDList) {
        currentIndex[repoID] = 0
    }

    while (merged.length < 8 && orgRepoIDList.length > 0) {
        let currentMaxRepoID = null as null | string
        let currentMaxCommit = null as null | ITimelineEvent

        let reposToRemove = [] as string[]
        for (let repoID of orgRepoIDList) {
            const uriStr = getConscienceURI(repoID)

            const list = commitListsByURI[uriStr]
            if (!list || list.length <= currentIndex[repoID]) {
                reposToRemove.push(repoID)
                continue
            }

            const commitHash = list[currentIndex[repoID]]
            if (!commitHash) {
                reposToRemove.push(repoID)
                continue
            }

            const commit = commits[commitHash]
            if (!commit) {
                reposToRemove.push(repoID)
                continue
            }

            if (!currentMaxCommit || commit.time > currentMaxCommit!.time) {
                currentMaxRepoID = repoID
                currentMaxCommit = commit
            }
        }

        if (currentMaxCommit && currentMaxRepoID) {
            merged.push(currentMaxCommit!.commit)
            currentIndex[currentMaxRepoID!]++
        }

        for (let repoID of reposToRemove) {
            orgRepoIDList = orgRepoIDList.filter(_repoID => repoID !== _repoID)
        }
    }

    return merged
}
