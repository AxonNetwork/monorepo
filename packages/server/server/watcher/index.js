import { dynamo } from '../config/aws'
import * as noderpc from '../noderpc'
import UpdatedRefEvent from '../models/updatedRefEvent'
import Cursors from '../models/cursor'

const watchNode = async (serverID) => {
    const rpcClient = noderpc.initClient()

    const cursors = await Cursors.get(serverID)
    const updatedRefStart = cursors.refLog !== undefined ? cursors.refLog + 1 : 0
    const eventTypes = [ rpcClient.EventType.UPDATED_REF ]

    const watcher = rpcClient.watch({ eventTypes, updatedRefStart })
    watcher.on('data', async (evt) => {
    	if (evt.updatedRef) {
    		const blockNumber = evt.updatedRef.refLog.blockNumber.toNumber()
    		await Promise.all([
	    		UpdatedRefEvent.create(evt.updatedRef.refLog),
	    		Cursors.setRefLogCursor(serverID, blockNumber),
            ])
    	}
    })
    watcher.on('error', (err) => {
    	console.error('Node Watcher err ~> ', err)
    })
}

export default watchNode
