import Repo from '../models/repo'
import * as noderpc from '../noderpc'
import { addRepoToCache } from './updateRepoCache'

const setupRepoCache = async function () {
    const rpcClient = noderpc.initClient()
    const local = await rpcClient.getLocalReposAsync({})
    const repoPromises = local.map(r => Repo.get(r.repoID))
    const repoList = await Promise.all(repoPromises)
    const needed = repoList.filter(r => r.currentHEAD === undefined || r.currentHEAD.length === 0)
    const cachePromises = needed.map(r => addRepoToCache(r.repoID))
    try {
	    await Promise.all(cachePromises)
    } catch (err) {
    	console.log('Error adding repo to cache ~> ', err)
    }
}

export default setupRepoCache
