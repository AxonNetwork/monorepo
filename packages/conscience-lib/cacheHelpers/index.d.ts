import { ITimelineEvent, ISecuredTextInfo, IRepoMetadata } from 'conscience-lib/common'
import { IRPCCommit, IRPCUpdatedRefEvent } from 'conscience-lib/rpc'

declare module 'conscience-lib/cacheHelpers' {
    export function interpolateTimeline(repoID: string, commits: IRPCCommit[], refEventsList: IRPCUpdatedRefEvent[]): ITimelineEvent[]
    export function getSecuredTextStats(repoID: string, timeline: ITimelineEvent[], filesByCommit: string[][], currentState: { [file: string]: ISecuredTextInfo }, fromInitialCommit: boolean): ISecuredTextInfo[]
    export function getRepoMetadata(repoID: string, timeline: ITimelineEvent[], refEventsList: IRPCUpdatedRefEvent[], currentMetadata: IRepoMetadata | undefined, fromInitialCommit: boolean): IRepoMetadata
}
