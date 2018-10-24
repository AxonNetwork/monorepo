import { ITimelineEvent } from 'common'

export function getLastVerifiedEvent(commitList: string[], commits: {[commitHash: string]: ITimelineEvent}) {
    for(let i=0; i < commitList.length; i++){
        const commit = commits[commitList[i]]
        if(i==0){
        }
        if(commit.verified !== undefined){
            return commit
        }
    }
    return undefined
}

export function getLastVerifiedEventFile(commitList: string[], commits: {[commitHash: string]: ITimelineEvent}, filename: string) {
    let eventIndex = -1
    for (let i = 0; i < commitList.length; i++) {
        const commit = commits[commitList[i]]
        if (commit.files.indexOf(filename) > -1) {
            eventIndex = i
            break
        }
    }
    for (let i = eventIndex; i >= 0; i--) {
        const commit = commits[commitList[i]]
        if (commit.verified !== undefined) {
            return commit
        }
    }
    return undefined
}

export function getLastVerifiedEventCommit(commitList: string[], commits: {[commitHash: string]: ITimelineEvent}, commitHash: string) {
    let eventIndex = -1
    for (let i = 0; i < commitList.length; i++) {
        if(commitHash === commitList[i]){
            eventIndex = i
            break
        }
    }
    for (let i = eventIndex; i >= 0; i--) {
        const commit = commits[commitList[i]]
        if (commit.verified !== undefined) {
            return commit
        }
    }
    return undefined
}

export function getFirstVerifiedEvent(commitList: string[], commits: {[commitHash: string]: ITimelineEvent}, filename: string|undefined) {
    let foundFile = false
    if(!filename){
        foundFile = true
    }
    const file = filename || "" // not undefined for typescript
    for (let i = commitList.length - 1; i >= 0; i--) {
        const commit = commits[commitList[i]]
        if (!foundFile && commit.files.indexOf(file) > -1) {
            foundFile = true
        }
        if (foundFile && commit.verified !== undefined) {
            return commit
        }
    }
    return undefined
}

export default {
    getLastVerifiedEvent,
    getLastVerifiedEventCommit,
    getLastVerifiedEventFile,
    getFirstVerifiedEvent,
}