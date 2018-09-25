import toilet from 'toiletdb'
import path from 'path'
// import mkdirp from 'mkdirp'
import Promise from 'bluebird'
const { app } = window.require('electron').remote

class UserData{}

UserData.conscienceLocation = path.join(app.getPath('documents'), 'Conscience')
// mkdirp(UserData.conscienceLocation)
UserData.settings = Promise.promisifyAll(toilet(path.join(UserData.conscienceLocation, '.user.json')), {suffix: "Async"})
UserData.settings.openAsync()

UserData.login = async function(user){
    // await UserData.settings.writeAsync('user', user)
}

UserData.getUser = async function(){
    const user = {
        email: 'daniel@test.com',
        name: 'Daniel Holmgren',
        jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhbmllbEB0ZXN0LmNvbSIsImlhdCI6MTUzNzg1NTU5M30.c5tZupqBHE2HpU1S4DuL7wuHJpuDPOn77E6E2I_YlHk'
    }
    await UserData.settings.readAsync('user')

    return user
}

UserData.getJWT = async function(){
    const user = await UserData.settings.readAsync('user')
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhbmllbEB0ZXN0LmNvbSIsImlhdCI6MTUzNzg1NTU5M30.c5tZupqBHE2HpU1S4DuL7wuHJpuDPOn77E6E2I_YlHk"
    // return user.jwt
}

UserData.logout = async function(){
    // await UserData.settings.writeAsync('user', {})
}

UserData.ignoreRepo = async function(pubkey){
    // let ignored = await UserData.settings.readAsync('ignored')
    // if(ignored === undefined){
    //     ignored = []
    // }
    // if(ignored.indexOf(pubkey) < 0){
    //     ignored.push(pubkey)
    // }
    // await UserData.settings.writeAsync("ignored", ignored)
}

UserData.isRepoIgnored = async function(pubkey){
    // const ignored = await UserData.settings.readAsync('ignored')
    // if(ignored === undefined) return false
    // return ignored.indexOf(pubkey) >= 0
    return true
}

export default UserData