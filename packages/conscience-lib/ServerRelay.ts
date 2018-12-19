import * as querystring from 'querystring'
import axios from 'axios'
import { IRepo, IRepoFile, IUser, IComment, IDiscussion, IOrganization, IUserSettings } from './common'

const API_URL = process.env.API_URL

const ServerRelay = {
    setJWT(token: string | undefined) {
        if (token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
        } else {
            axios.defaults.headers.common['Authorization'] = undefined
        }
    },

    async login(email: string, password: string) {
        interface IResponse {
            userID: string
            emails: string[]
            name: string
            username: string
            picture: string
            token: string
            mnemonic: string
        }

        let resp
        try {
            resp = await axios.post<IResponse>(API_URL + '/login', { email, password })
        } catch (err) {
            if (err.response.status === 403) {
                return new Error(err.response.data.error)
            } else if (err.response.status === 400) {
                return new Error(err.response.data.error)
            }
            throw err.response.data.error
        }

        ServerRelay.setJWT(resp.data.token)
        return {
            userID: resp.data.userID,
            emails: resp.data.emails,
            name: resp.data.name,
            username: resp.data.username,
            picture: resp.data.picture,
            jwt: resp.data.token,
            mnemonic: resp.data.mnemonic,
        }
    },

    async loginWithKey(username: string, hexSignature: string) {
        interface IResponse {
            userID: string
            emails: string[]
            name: string
            username: string
            picture: string
            token: string
        }

        let resp
        try {
            resp = await axios.post<IResponse>(API_URL + '/login-with-key', { username, hexSignature })
        } catch (err) {
            if (err.response.status === 403) {
                return new Error(err.response.data.error)
            } else if (err.response.status === 400) {
                return new Error(err.response.data.error)
            }
            throw err.response.data.error
        }

        ServerRelay.setJWT(resp.data.token)
        return {
            userID: resp.data.userID,
            emails: resp.data.emails,
            name: resp.data.name,
            username: resp.data.username,
            picture: resp.data.picture,
            jwt: resp.data.token,
        }
    },

    async signup(name: string, username: string, email: string, password: string, hexSignature: string, mnemonic: string) {
        interface IResponse {
            userID: string
            emails: string[]
            name: string
            username: string
            token: string
        }

        let resp
        try {
            resp = await axios.post<IResponse>(API_URL + '/create-user', { name, username, email, password, hexSignature, mnemonic })
        } catch (err) {
            if (err.response.status === 403) {
                return new Error('Access denied')
            } else if (err.response.status === 400) {
                return new Error(err.response.data.error)
            }
            throw err.response.data.error
        }

        ServerRelay.setJWT(resp.data.token)
        return {
            userID: resp.data.userID,
            emails: resp.data.emails,
            name: resp.data.name,
            username: resp.data.username,
            jwt: resp.data.token,
        }
    },

    async whoami() {
        interface IResponse {
            userID: string
            name: string
            username: string
            emails: string[]
            picture: string
        }

        const response = await axios.get<IResponse>(API_URL + '/whoami')
        return {
            userID: response.data.userID,
            emails: response.data.emails,
            name: response.data.name,
            username: response.data.username,
            picture: response.data.picture,
        }
    },

    async getEthBalance(address: string) {
        interface IResponse {
            balance: number
        }
        const resp = await axios.get<IResponse>(API_URL + '/balance?address=' + address)
        return resp.data.balance
    },

    async hitEthFaucet(address: string) {
        interface IResponse { }
        await axios.post<IResponse>(API_URL + '/faucet', {
            address: address,
            amount: 10,
        })
    },

    async createRepo(repoID: string) {
        interface IResponse { }
        await axios.post<IResponse>(API_URL + '/create-repo', { repoID })
    },

    async shareRepo(repoID: string, userID: string | undefined, email?: string) {
        interface IResponse {
            repoID: string
            userID: string
        }
        const resp = await axios.post<IResponse>(API_URL + '/share-repo', { repoID, userID, email })
        return resp.data
    },

    async getSharedUsers(repoID: string) {
        interface IResponse {
            sharedUsers: { name: string, userID: string }[]
        }

        const response = await axios.get<IResponse>(API_URL + '/shared-users?repoID=' + repoID)
        return response.data.sharedUsers
    },

    async unshareRepo(repoID: string, userID: string) {
        interface IResponse {
            message: string
        }
        await axios.post<IResponse>(API_URL + '/unshare-repo', { repoID, userID })
    },

    async getSharedRepos(userID: string) {
        interface IResponse {
            sharedRepos: string[]
        }

        const response = await axios.get<IResponse>(API_URL + '/shared-repos?userID=' + userID)
        return response.data.sharedRepos
    },

    async getRepoList() {
        interface IResponse {
            repoIDs: string[]
        }
        const response = await axios.get<IResponse>(API_URL + '/repolist')
        return response.data.repoIDs
    },

    async getRepo(repoID: string) {
        let response
        try{
            response = await axios.get<IRepo>(API_URL + '/repo/' + repoID)
        }catch(err){
            // repo does not exist
            if (err.response.status === 404) {
                return new Error(err.response.data.error)
            }
            throw err.respponse.data.error
        }
        return response.data
    },

    async getFile(repoID: string, filename: string) {
        interface IResponse {
            exists: boolean
            file: IRepoFile
        }
        const response = await axios.get<IResponse>(API_URL + '/repo/' + repoID + '/file/' + filename)
        return response.data
    },

    async saveFileContents(repoID: string, filename: string, contents: string) {
        interface IResponse {
            file: IRepoFile
        }
        const response = await axios.post<IResponse>(API_URL + '/repo/' + repoID + '/file/' + filename, {
            contents,
        })
        return response.data
    },

    async getDiff(repoID: string, commit: string) {
        interface IResponse {
            diffs: {[filename: string]: string}
        }
        const response = await axios.get<IResponse>(API_URL + '/repo/' + repoID + '/diff/' + commit)
        return response.data
    },

    async getDiscussionsForRepo(repoID: string) {
        interface IResponse {
            discussions: IDiscussion[]
        }

        const response = await axios.get<IResponse>(API_URL + '/discussion?repoID=' + repoID)
        return response.data.discussions
    },

    async getCommentsForDiscussion(discussionID: string) {
        interface IResponse {
            comments: IComment[]
        }

        const response = await axios.get<IResponse>(API_URL + '/all-comments?discussionID=' + discussionID)
        return response.data.comments
    },

    async createDiscussion(repoID: string, subject: string, commentText: string) {
        interface IResponse {
            comment: IComment
            discussion: IDiscussion
        }

        const response = await axios.post<IResponse>(API_URL + '/discussion', { repoID, subject, commentText })
        return response.data
    },

    async createComment(repoID: string, discussionID: string, text: string) {
        interface IResponse {
            newComment: IComment
        }
        const response = await axios.post<IResponse>(API_URL + '/create-comment', { repoID, discussionID, text })
        return response.data.newComment
    },

    async fetchUsers(userIDs: string[]) {
        const response = await axios.get(API_URL + '/users?' + querystring.stringify({ userIDs }))
        return response.data as IUser[]
    },

    async fetchUsersByEmail(emails: string[]) {
        const response = await axios.get(API_URL + '/users-by-email?' + querystring.stringify({ emails }))
        return response.data as IUser[]
    },

    async uploadUserPicture(fileInput: HTMLInputElement) {
        interface IResponse {
            picture: string
            userID: string
        }

        if (!fileInput.files) { throw new Error('no files') }

        const formData = new FormData()
        formData.append('user-photo', fileInput.files[0])
        const resp = await axios.post<IResponse>(API_URL + '/user-photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return resp.data
    },

    async modifyEmail(email: string, add: boolean) {
        await axios.post<{}>(API_URL + '/user/email', { email, add })
    },

    async getUserSettings() {
        const settings = await axios.get<IUserSettings>(API_URL + '/user/settings')
        return settings.data
    },

    async updateUserSettings(settings: IUserSettings) {
        const updated = await axios.post<IUserSettings>(API_URL + "/user/settings", { settings })
        return updated.data
    },

    async sawComment(repoID: string, discussionID: string, commentTimestamp: number) {
        interface IResponse {}
        await axios.post<IResponse>(API_URL + "/user/sawComment", {
            repoID,
            discussionID,
            commentTimestamp
        })
    },

    async createOrg(name: string) {
        const response = await axios.post(API_URL + '/create-organization', { name })
        return response.data as IOrganization
    },

    async fetchOrgs(userID: string) {
        interface IResponse {
            orgs: string[]
        }
        const response = await axios.get<IResponse>(API_URL + '/organizations?' + querystring.stringify({ userID }))

        return response.data
    },

    async fetchOrgInfo(orgID: string) {
        const response = await axios.get(API_URL + '/organization/' + orgID)
        return response.data as IOrganization
    },

    async updateOrg(orgID: string, name: string | undefined, description: string | undefined, readme: string | undefined) {
        const response = await axios.post(API_URL + '/update-organization', {
            orgID,
            name,
            description,
            readme,
        })

        return response.data
    },


    async uploadOrgPicture(orgID: string, fileInput: HTMLInputElement) {
        interface IResponse {
            picture: string
            orgID: string
        }

        if (!fileInput.files) { throw new Error('no files') }

        const formData = new FormData()
        formData.set('orgID', orgID)
        formData.append('org-photo', fileInput.files[0])
        const resp = await axios.post<IResponse>(API_URL + '/org-photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return resp.data
    },

    async addMemberToOrg(orgID: string, userID: string) {
        await axios.post(API_URL + '/add-member-to-org/', { orgID, userID })
    },

    async removeMemberFromOrg(orgID: string, userID: string) {
        await axios.post(API_URL + '/remove-member-from-org/', { orgID, userID })
    },

    async addRepoToOrg(orgID: string, repoID: string) {
        await axios.post(API_URL + '/add-repo-to-org/', { orgID, repoID })
    },

    async removeRepoFromOrg(orgID: string, repoID: string) {
        await axios.post(API_URL + '/remove-repo-from-org/', { orgID, repoID })
    },

    async changeOrgDescription(orgID: string, description: string) {
        return
    },
}

axios.defaults.timeout = 10000

export default ServerRelay
