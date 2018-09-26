import axios from 'axios'
import Promise from 'bluebird'
import to from 'await-to-js'
// import querystring from 'querystring'

class ServerRelay{}

// ServerRelay.api = 'http://demo.conscience.network/api'
ServerRelay.api = 'http://localhost:8080/api'

axios.defaults.timeout = 10000

ServerRelay.setJWT = function(token){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

ServerRelay.removeJWT = function(){
    axios.defaults.headers.common['Authorization'] = undefined
}

ServerRelay.login = async function(email, password){
    const [err, response] = await to(axios.post(this.api + '/login', {
        email: email,
        password: password
    }))
    if(err) throw err.response.data.error
    this.setJWT(response.data.token)
    return {
        email: email,
        name: response.data.name,
        jwt: response.data.token
    }
}

ServerRelay.signup = async function(name, email, password){
    const [err, response] = await to(axios.post(this.api + '/create-user', {
        name: name,
        email: email,
        password: password
    }))
    if(err) throw err.response.data.error
    this.setJWT(response.data.token)
    return {
        email: email,
        name: name,
        jwt: response.data.token
    }
}

ServerRelay.createRepo = async function(repoID, secretKey){
    const [err, response] = await to(axios.post(this.api + '/create-repo', {
        repoID: repoID,
        secretKey: secretKey,
    }))
    if(err) throw err.response.data.error
    return response
}

ServerRelay.shareRepo = async function(repoID, email){
    const [err, response] = await to(axios.post(this.api + '/share-repo', {
        repoID: repoID,
        email: email
    }))
    if(err) throw err.response.data.error
    return response
}

ServerRelay.getSharedUsers = async function(repoID){
    const [err, response] = await to(axios.get(this.api+'/shared-users?repoID='+repoID))
    if(err) throw err.response.data.error
    return response.data.sharedUsers
}

ServerRelay.unshareRepo = async function(repoID, email){
    const [err, response] = await to(axios.post(this.api + '/unshare-repo', {
        repoID: repoID,
        email: email
    }))
    if(err) throw err.response.data.error
    return response
}

ServerRelay.getSharedRepos = async function(email){
    const response= await axios.get(this.api+'/shared-repos?email='+email)
    return response.data.sharedRepos
}

ServerRelay.getDiscussions = async function(repoID){
    const [err, response] = await to(axios.get(this.api+'/discussion?repoID='+repoID))
    if(err) throw err.response.data.error
    return response.data.discussions
}

ServerRelay.getComments = async function(repoID){
    const [err, response] = await to(axios.get(this.api+'/all-comments?repoID='+repoID))
    if(err) throw err.response.data.error
    return response.data.comments
}

ServerRelay.createDiscussion = async function(repoID, subject, commentText){
    const [err, response] = await to(axios.post(this.api+'/discussion', {
        repoID: repoID,
        subject: subject,
        commentText: commentText
    }))
    if(err) throw err.response.data.error
    return response.data
}

ServerRelay.createComment = async function(repoID, text, attachedTo){
    const [err, response] = await to(axios.post(this.api+'/create-comment', {
        repoID: repoID,
        text: text,
        attachedTo: attachedTo
    }))
    if(err) throw err.response.data.error
    return response.data
}

ServerRelay.fetchUsers = async function(emails){
    let queryString = '?'
    for(let i=0; i<emails.length; i++){
        if (i>0){
            queryString += "&"
        }
        queryString+="emails="+emails[i]
    }
    const [err, response] = await to(axios.get(this.api+'/users'+queryString))
    if(err) throw err.response.data.error
    return response.data
}

export default ServerRelay
