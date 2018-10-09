import { ITimelineEvent } from 'common'

export function getLastVerifiedEvent(commitList: string[], commits: {[commitHash: string]: ITimelineEvent}){
    const commitHash = commitList.find(c=>commits[c].verified !== undefined)
    if(commitHash === undefined){
        return undefined
    }
    return commits[commitHash]
}

export function getFirstVerifiedEvent(commitList: string[], commits: {[commitHash: string]: ITimelineEvent}, filename: string){
    let foundFile = false
    for(let i=commitList.length - 1; i>=0; i--){
        const commit=commits[commitList[i]]
        if(!foundFile && commit.files.indexOf(filename) > -1){
            foundFile = true
        }
        if(foundFile && commit.verified !== undefined){
            return commit
        }
    }
    return undefined
}