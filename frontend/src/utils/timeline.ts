import { ITimelineEvent } from 'common'

export function getLastVerifiedEvent(commitList: string[], commits: {[commitHash: string]: ITimelineEvent}, filename: string){
    let eventIndex = -1
    for(let i=0; i<commitList.length; i++){
        const commit = commits[commitList[i]]
        if(commit.files.indexOf(filename) > -1){
            eventIndex = i
            break
        }
    }
    for(let i=eventIndex; i >= 0; i--){
        const commit = commits[commitList[i]]
        if(commit.verified !== undefined){
            return commit
        }
    }
    return undefined
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