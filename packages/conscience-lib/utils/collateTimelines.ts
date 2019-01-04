import { IRepo, ITimelineEvent } from 'conscience-lib/common'

interface IEventToAdd {
	repoID: string
	index: number
	event: ITimelineEvent | undefined
}

export default function collateTimelines(toCollate: IRepo[]){
	const repos = toCollate.filter(repo => repo !== undefined && repo.repoID !== undefined)
	// let currentEvents = {} as { [repoID: string]: ICurrentEvent }
	const lastEventAdded = {} as { [repoID: string]: number }
	const commits = {} as { [commit: string]: ITimelineEvent }
	const commitList = [] as string[]
	while(commitList.length < 8){
		const toAdd = repos
		.map((repo: IRepo) => {
			const lastAdded = lastEventAdded[repo.repoID]
			const index = lastAdded !== undefined ? lastAdded + 1 : 0
			const commit = (repo.commitList || [])[index]
			return {
				repoID: repo.repoID,
				index,
				event: (repo.commits || {})[commit],
			} as IEventToAdd
		})
		.reduce((acc, curr) => {
			if(curr.event === undefined){ return acc }
			if(acc.event === undefined){ return curr }
			if(curr.event.time > acc.event.time){ return curr }
			return acc
		}, {} as IEventToAdd)
		if(toAdd.event === undefined){
			break
		}
		const hash = toAdd.event.commit
		commitList.push(hash)
		commits[hash] = {
			...toAdd.event,
			repoID: toAdd.repoID,
		}
		lastEventAdded[toAdd.repoID] = toAdd.index
	}
	return { commits, commitList }
}

