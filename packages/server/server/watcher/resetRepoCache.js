import Repo from '../models/repo'
import * as noderpc from '../noderpc'
import { updateRepoCache } from './updateRepoCache'

const resetRepoCache = async function () {
    const rpcClient = noderpc.initClient()
    // const local = await rpcClient.getLocalReposAsync({})
    // const repoPromises = local.map(r => Repo.resetCache(r.repoID))
    const toDelete = [ 'conscience-drive' ]
    const repoPromises = toDelete.map(id => Repo.resetCache(id))
    const repoList = await Promise.all(repoPromises)
    console.log('REPO CACHE RESET')
}

export default resetRepoCache
