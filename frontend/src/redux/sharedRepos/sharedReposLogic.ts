import { createLogic } from 'redux-logic'
import { FETCH_SHARED_REPOS, GOT_SHARED_REPO, ADD_SHARED_REPO, ADD_SHARED_REPO_SUCCESS, IGNORE_REPO } from './sharedReposActions'
import { FETCHED_REPO, SELECT_REPO } from '../repository/repoActions'
import ServerRelay from '../../lib/ServerRelay'
import UserData from '../../lib/UserData'
import to from 'await-to-js'
import ConscienceRelay from '../../lib/ConscienceRelay';

const getSharedRepos = createLogic({
    type: FETCH_SHARED_REPOS,
    async process({ getState, action }, dispatch, done) {
        const repos = getState().repository.repos
        const repoList = Object.keys(repos).map(r=>repos[r].repoID)
        const user = getState().user.email
        const sharedRepos = await ServerRelay.getSharedRepos(user)
        if(sharedRepos === undefined) done()
        const toDownload = sharedRepos.filter(repo => repoList.indexOf(repo) < 0)
        for(let i=0; i<toDownload.length; i++){
            const repoID = toDownload[i]
            const ignored = await UserData.isRepoIgnored(repoID)
            await dispatch({
                type: GOT_SHARED_REPO,
                repo: {
                    repoID: repoID,
                    ignored: ignored
                }
            })
        }
        done()
      }
})

const addSharedRepo = createLogic({
    type: ADD_SHARED_REPO,
    async process({ getState, action }, dispatch, done) {
        const [err, repo] = await to(ConscienceRelay.cloneRepo(action.repoID, UserData.conscienceLocation))
        if(err) done()
        await dispatch({
            type: ADD_SHARED_REPO_SUCCESS,
            repo: repo
        })
        await dispatch({
            type: FETCHED_REPO,
            repo: repo
        })
        await dispatch({
            type: SELECT_REPO,
            repo: repo
        })
        done()
    }
})

const ignoreRepo = createLogic({
    type: IGNORE_REPO,
    async process({ getState, action }, dispatch, done) {
        await UserData.ignoreRepo(action.repoID)
        done()
    }
})

export default [
    getSharedRepos,
    addSharedRepo,
    ignoreRepo
]