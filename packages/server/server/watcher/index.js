import * as noderpc from '../noderpc'
import Repo from '../models/repo'
import { addRepoToCache, updateRepoInCache } from './updateRepoCache'

const watchNode = async () => {
    const rpcClient = noderpc.initClient()

    const updatedRefEvents = []

    const eventTypes = [
        rpcClient.EventType.ADDED_REPO,
        rpcClient.EventType.PULLED_REPO,
        rpcClient.EventType.UPDATED_REF,
    ]

    const watcher = rpcClient.watch({ eventTypes })
    watcher.on('data', async (evt) => {
        if (evt.addedRepoEvent) {
            await addRepoToCache(evt.repoID)
        }
        if (evt.pulledRepoEvent) {
            const updatedRefEventsRev = updatedRefEvents.reverse()
            const repo = await Repo.get(evt.repoID)
            await updateRepoInCache(evt.repoID, updatedRefEventsRev, repo.currentHEAD)
        }
    	if (evt.updatedRefEvent) {
            updatedRefEvents.push(evt.updatedRefEvent)
    	}
    })
    watcher.on('error', (err) => {
    	console.error('Node Watcher err ~> ', err)
    })
    watcher.on('end', () => {
        console.error('Node Watcher err ~> Connection borken with node')
    })
}

export default watchNode
