import querystring from 'querystring'
import axios from 'axios'
import { IUser, IComment, IDiscussion } from '../common'

// @@TODO: this should come from process.env
// const API_URL = 'http://demo.conscience.network/api',
const API_URL = 'http://localhost:8080/api'

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
            email: string
            name: string
            picture: string
            token: string
        }

        let resp
        try {
            resp = await axios.post<IResponse>(API_URL + '/login', { email, password })
        } catch (err) {
            throw err.response.data.error
        }

        ServerRelay.setJWT(resp.data.token)
        return {
            userID: resp.data.userID,
            email: resp.data.email,
            name: resp.data.name,
            picture: resp.data.picture,
            jwt: resp.data.token,
        }
    },

    async signup(name: string, email: string, password: string, hexSignature: string) {
        interface IResponse {
            userID: string
            email: string
            name: string
            token: string
        }

        let resp
        try {
            resp = await axios.post<IResponse>(API_URL + '/create-user', { name, email, password, hexSignature })
        } catch (err) {
            throw err.response.data.error
        }

        ServerRelay.setJWT(resp.data.token)
        return {
            userID: resp.data.userID,
            email: resp.data.email,
            name: resp.data.name,
            jwt: resp.data.token,
        }
    },

    async whoami() {
        interface IResponse {
            userID: string
            name: string
            emails: string[]
            picture: string
        }

        const response = await axios.get<IResponse>(API_URL + '/whoami')
        return {
            userID: response.data.userID,
            emails: response.data.emails,
            name: response.data.name,
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

    async shareRepo(repoID: string, userID: string) {
        interface IResponse {
            message: string
        }
        await axios.post<IResponse>(API_URL + '/share-repo', { repoID, userID })
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

    async addEmail(email: string) {
        await axios.post<{}>(API_URL + '/user-email/add', { email })
    },
}

window.ServerRelay = ServerRelay
axios.defaults.timeout = 10000

export default ServerRelay
