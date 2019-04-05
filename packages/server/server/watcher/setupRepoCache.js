import Repo from '../models/repo'
import * as noderpc from '../noderpc'
import { updateRepoCache } from './updateRepoCache'

const setupRepoCache = async function () {
    const rpcClient = noderpc.initClient()
    const local = await rpcClient.getLocalReposAsync({})
    const repoPromises = local.map(r => Repo.get(r.repoID))
    const repoList = await Promise.all(repoPromises)
    const cachePromises = repoList.map(r => updateRepoCache(r.repoID))
    try {
	    await Promise.all(cachePromises)
    } catch (err) {
    	console.log('Error adding repo to cache ~> ', err)
    }
}

export default setupRepoCache
