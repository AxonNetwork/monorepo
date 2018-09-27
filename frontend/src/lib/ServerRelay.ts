import axios from 'axios'
import to from 'await-to-js'
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
        interface Response {
            name: string
            token: string
        }
        const response = await axios.post<Response>(API_URL + '/login', { email, password })
        ServerRelay.setJWT(response.data.token)
        return {
            email: email,
            name: response.data.name,
            jwt: response.data.token
        }
    },

    async signup(name: string, email: string, password: string) {
        interface Response {
            token: string
        }
        const response = await axios.post<Response>(API_URL + '/create-user', { name, email, password })
        ServerRelay.setJWT(response.data.token)
        return {
            email,
            name,
            jwt: response.data.token
        }
    },

    async createRepo(repoID: string) {
        interface Response {}
        await axios.post<Response>(API_URL + '/create-repo', { repoID })
    },

    async shareRepo(repoID: string, email: string) {
        const [err, response] = await to(axios.post(API_URL + '/share-repo', {
            repoID: repoID,
            email: email
        }))
        if (err) throw err.response.data.error
        return response
    },

    async getSharedUsers(repoID: string) {
        interface Response {
            sharedUsers: { name: string, email: string }[]
        }
        const response = await axios.get<Response>(API_URL+'/shared-users?repoID='+repoID)
        return response.data.sharedUsers
    },

    async unshareRepo(repoID: string, email: string) {
        const [err, response] = await to(axios.post(API_URL + '/unshare-repo', {
            repoID: repoID,
            email: email
        }))
        if (err) throw err.response.data.error
        return response
    },

    async getSharedRepos(email: string) {
        const response= await axios.get(API_URL+'/shared-repos?email='+email)
        return response.data.sharedRepos
    },

    async getDiscussionsForRepo(repoID: string) {
        interface Response {
            discussions: IDiscussion[]
        }
        const response = await axios.get<Response>(API_URL+'/discussion?repoID='+repoID)
        return response.data.discussions
    },

    async getCommentsForRepo(repoID: string) {
        interface Response {
            comments: IComment[]
        }
        const response = await axios.get<Response>(API_URL+'/all-comments?repoID='+repoID)
        return response.data.comments
    },

    async createDiscussion(repoID: string, subject: string, commentText: string) {
        interface Response {
            comment: IComment
            discussion: IDiscussion
        }
        const response = await axios.post<Response>(API_URL+'/discussion', { repoID, subject, commentText })
        return response.data
    },

    async createComment(repoID: string, text: string, attachedTo: IAttachedTo) {
        interface Response {
            newComment: IComment
        }
        const response = await axios.post<Response>(API_URL+'/create-comment', {
            repoID: repoID,
            text: text,
            attachedTo: attachedTo
        })
        return response.data.newComment
    },

    async fetchUsers(emails: string[]) {
        // @@TODO: use querystring module
        let queryString = '?'
        for (let i = 0; i < emails.length; i++){
            if (i > 0){
                queryString += "&"
            }
            queryString+="emails="+emails[i]
        }
        const response = await axios.get(API_URL+'/users'+queryString)
        return response.data as IUser[]
    },
}

axios.defaults.timeout = 10000

export default ServerRelay
