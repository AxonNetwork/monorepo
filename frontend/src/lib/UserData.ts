import path from 'path'
import { uniq } from 'lodash'
const { app } = (window as any).require('electron').remote
const fs = (window as any).require('fs')

export const CONFIG_PATH = path.join(app.getPath('home'), '.conscience.app.json')
export const CONSCIENCE_LOCATION = path.join(app.getPath('documents'), 'Conscience')

export interface IUserDataContents {
    jwt?: string
    ignoredSharedRepos?: string[]
    codeColorScheme?: string
    menuLabelsHidden?: boolean
}

const UserData = {
    __cached: null as IUserDataContents | null,

    async readAll() {
        if (UserData.__cached !== null) {
            return Promise.resolve<IUserDataContents>(UserData.__cached)
        }

        return new Promise<IUserDataContents>((resolve, reject) => {
            fs.readFile(CONFIG_PATH, (err: Error, bytes: string) => {
                if (err) {
                    return reject(err)
                }
                const data = JSON.parse(bytes)
                UserData.__cached = data as IUserDataContents
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

        UserData.__cached = data

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

    async setJWT(jwt: string | undefined) {
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

    async codeColorScheme() {
        return UserData.get('codeColorScheme')
    },

    async setCodeColorScheme(codeColorScheme: string) {
        await UserData.set('codeColorScheme', codeColorScheme)
    },

    async hideMenuLabels(menuLabelsHidden: boolean) {
        await UserData.set('menuLabelsHidden', menuLabelsHidden)
    },
}

export default UserData