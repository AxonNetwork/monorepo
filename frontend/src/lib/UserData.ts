import path from 'path'
import { uniq } from 'lodash'
const { app } = (window as any).require('electron').remote
const fs = (window as any).require('fs')

export const CONFIG_PATH = path.join(app.getPath('home'), '.conscience.app.json')

export interface IUserDataContents {
    jwt?: string
    ignoredSharedRepos?: string[]
}

const UserData = {
    async readAll() {
        return new Promise<IUserDataContents>((resolve, reject) => {
            fs.readFile(CONFIG_PATH, (err: Error, bytes: string) => {
                if (err) {
                    return reject(err)
                }
                const data = JSON.parse(bytes)
                resolve(data)
            })
        })
    },

    async get(key: keyof IUserDataContents) {
        const data = await UserData.readAll()
        return data[key]
    },

    async set(key: keyof IUserDataContents, value: any) {
        let data: IUserDataContents
        try {
            data = await UserData.readAll()
        } catch (err) {
            data = {}
        }

        if (value === undefined) {
            delete data[key]
        } else {
            data[key] = value
        }

        return new Promise((resolve, reject) => {
            fs.writeFile(CONFIG_PATH, JSON.stringify(data), (err: Error) => {
                if (err) { return reject(err) }
                resolve()
            })
        })
    },

    async getJWT() {
        return ((await UserData.get('jwt')) || undefined) as string
    },

    async setJWT(jwt: string|undefined) {
        await UserData.set('jwt', jwt)
    },

    async isRepoIgnored(repoID: string) {
        let ignoredSharedRepos = (await UserData.get('ignoredSharedRepos') || []) as string[]
        return ignoredSharedRepos.includes(repoID)
    },

    async ignoreSharedRepo(repoID: string) {
        let ignoredSharedRepos = (await UserData.get('ignoredSharedRepos') || []) as string[]
        ignoredSharedRepos.push(repoID)
        ignoredSharedRepos = uniq(ignoredSharedRepos)
        await UserData.set('ignoredSharedRepos', ignoredSharedRepos)
    },
}


// UserData.conscienceLocation = path.join(app.getPath('documents'), 'Conscience')
// mkdirp(UserData.conscienceLocation)
// UserData.settings = Promise.promisifyAll(toilet(path.join(UserData.conscienceLocation, '.user.json')), {suffix: "Async"})
// UserData.settings.openAsync()

// UserData.login = async function(user){
//     await UserData.settings.writeAsync('user', user)
// }

// UserData.getUser = async function(){
//     const user = await UserData.settings.readAsync('user')
//     return user
// }

// UserData.getJWT = async function(){
//     const user = await UserData.settings.readAsync('user')
//     return user.jwt
// }

// UserData.logout = async function(){
//     await UserData.settings.writeAsync('user', {})
// }

// UserData.ignoreSharedRepo = async function(pubkey){
//     let ignored = await UserData.settings.readAsync('ignored')
//     if(ignored === undefined){
//         ignored = []
//     }
//     if(ignored.indexOf(pubkey) < 0){
//         ignored.push(pubkey)
//     }
//     await UserData.settings.writeAsync("ignored", ignored)
// }

// UserData.isRepoIgnored = async function(pubkey){
//     const ignored = await UserData.settings.readAsync('ignored')
//     if(ignored === undefined) return false
//     return ignored.indexOf(pubkey) >= 0
// }

export default UserData