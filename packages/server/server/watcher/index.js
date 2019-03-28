import * as noderpc from '../noderpc'
import Repo from '../models/repo'
import { updateRepoCache } from './updateRepoCache'

let retried = false
let watcher

const watchNode = async () => {
    const rpcClient = noderpc.initClient()

    const eventTypes = [
        rpcClient.EventType.ADDED_REPO,
        rpcClient.EventType.PULLED_REPO,
    ]

    watcher = rpcClient.watch({ eventTypes })
    watcher.on('data', async (evt) => {
        retried = false
        if (evt.addedRepoEvent) {
            await updateRepoCache(evt.addedRepoEvent.repoID)
        }
        if (evt.pulledRepoEvent) {
            await updateRepoCache(evt.pulledRepoEvent.repoID)
        }
    })
    watcher.on('error', (err) => {
    	console.error('Node Watcher err ~> ', err)
        watcher.destroy()
        if (retried) {
            setTimeout(watchNode, 3000)
        } else {
            retried = true
            watchNode()
        }
    })
    watcher.on('end', () => {
        console.error('Node Watcher err ~> Connection borken with node')
    })
}

export default watchNode
