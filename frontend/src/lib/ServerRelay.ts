import axios from 'axios'
import { IUser, IComment, IAttachedTo, IDiscussion } from '../common'

// @@TODO: this should come from process.env
// const API_URL = 'http://demo.conscience.network/api',
const API_URL = 'http://localhost:8080/api'

const ServerRelay = {
    setJWT(token: string) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    },

    removeJWT() {
        axios.defaults.headers.common['Authorization'] = undefined
    },

    async login(email: string, password: string) {
        interface IResponse {
            name: string
            token: string
        }

        let response
        try {
            response = await axios.post<IResponse>(API_URL + '/login', { email, password })
        } catch (err) {
            throw err.response.data.error
        }

        ServerRelay.setJWT(response.data.token)
        return {
            email: email,
            name: response.data.name,
            jwt: response.data.token,
        }
    },

    async signup(name: string, email: string, password: string) {
        interface IResponse {
            token: string
        }

        let response
        try {
            response = await axios.post<IResponse>(API_URL + '/create-user', { name, email, password })
        } catch (err) {
            throw err.response.data.error
        }

        ServerRelay.setJWT(response.data.token)
        return {
            email,
            name,
            jwt: response.data.token,
        }
    },

    async whoami(jwt: string) {
        interface IResponse {
            name: string
            email: string
        }

        ServerRelay.setJWT(jwt)
        const response = await axios.get<IResponse>(API_URL + '/whoami?jwt=' + jwt)
        return {
            email: response.data.email,
            name: response.data.name,
        }
    },

    async createRepo(repoID: string) {
        interface IResponse { }
        await axios.post<IResponse>(API_URL + '/create-repo', { repoID })
    },

    async shareRepo(repoID: string, email: string) {
        interface IResponse {
            message: string
        }
        await axios.post<IResponse>(API_URL + '/share-repo', { repoID, email })
    },

    async getSharedUsers(repoID: string) {
        interface IResponse {
            sharedUsers: { name: string, email: string }[]
        }

        const response = await axios.get<IResponse>(API_URL + '/shared-users?repoID=' + repoID)
        return response.data.sharedUsers
    },

    async unshareRepo(repoID: string, email: string) {
        interface IResponse {
            message: string
        }
        await axios.post<IResponse>(API_URL + '/unshare-repo', { repoID, email })
    },

    async getSharedRepos(email: string) {
        interface IResponse {
            sharedRepos: string[]
        }

        const response = await axios.get<IResponse>(API_URL + '/shared-repos?email=' + email)
        return response.data.sharedRepos
    },

    async getDiscussionsForRepo(repoID: string) {
        interface IResponse {
            discussions: IDiscussion[]
        }

        const response = await axios.get<IResponse>(API_URL + '/discussion?repoID=' + repoID)
        return response.data.discussions
    },

    async getCommentsForRepo(repoID: string) {
        interface IResponse {
            comments: IComment[]
        }

        const response = await axios.get<IResponse>(API_URL + '/all-comments?repoID=' + repoID)
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

    async createComment(repoID: string, text: string, attachedTo: IAttachedTo) {
        interface IResponse {
            newComment: IComment
        }
        const response = await axios.post<IResponse>(API_URL + '/create-comment', { repoID, text, attachedTo })
        return response.data.newComment
    },

    async fetchUsers(emails: string[]) {
        // @@TODO: use querystring module
        let queryString = '?'
        for (let i = 0; i < emails.length; i++) {
            if (i > 0) {
                queryString += '&'
            }
            queryString += 'emails=' + emails[i]
        }
        const response = await axios.get(API_URL + '/users' + queryString)
        return response.data as IUser[]
    },
}

axios.defaults.timeout = 10000

export default ServerRelay
