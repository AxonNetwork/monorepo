import path from 'path'
import uniq from 'lodash/uniq'
// import toml from 'toml-j0.4'
// import tomlify from 'tomlify-j0.4'
const { app } = (window as any).require('electron').remote
const fs = (window as any).require('fs')
import * as rpc from 'conscience-lib/rpc'

export const CONFIG_PATH = path.join(app.getPath('home'), '.axon.app.json')
export const AXONRC_PATH = path.join(app.getPath('home'), '.axonrc')

interface ICommentTimestamp {
    [repoID: string]: {
        [discussionID: string]: number,
    }
}

export interface IUserDataContents {
    jwt?: string
    ignoredSharedRepos?: string[]
    codeColorScheme?: string
    menuLabelsHidden?: boolean
    fileExtensionsHidden?: boolean
    manualChunking?: boolean
    newestViewedCommentTimestamp?: ICommentTimestamp
    mostRecentChangelogSeen?: string
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

    async merge(newData: IUserDataContents) {
        let data: IUserDataContents
        try {
            data = await UserData.readAll()
        } catch (err) {
            data = {}
        }

        data = { ...data, ...newData }

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

    async setNewestViewedCommentTimestamp(repoID: string, discussionID: string, commentTimestamp: number) {
        const timestamps = ((await UserData.get('newestViewedCommentTimestamp')) || {}) as ICommentTimestamp
        if (
            (timestamps[repoID] || {})[discussionID] !== undefined &&
            (timestamps[repoID] || {})[discussionID] >= commentTimestamp
        ) {
            return false
        }
        timestamps[repoID] = timestamps[repoID] || {}
        timestamps[repoID][discussionID] = commentTimestamp
        await UserData.set('newestViewedCommentTimestamp', timestamps)
        return true
    },

    async getMnemonic() {
        // const contents = fs.readFileSync(AXONRC_PATH)
        // const parsed = toml.parse(contents.toString()) as any
        // return (parsed.node || {}).EthereumBIP39Seed || ''

        const rpcClient = rpc.getClient()
        console.log('rpcclient', rpcClient)
        try {
        const { seed } = await (rpcClient as any).getEthereumBip39SeedAsync({})
        console.log('seed ~>', seed)
        return seed
    } catch (err) {
        console.error('getMnemonic error~>', err)
    }
    return ''
    },

    async setMnemonic(seed: string) {
        const rpcClient = rpc.getClient()
        try {
        await (rpcClient as any).setEthereumBip39SeedAsync({ seed })
    } catch (err) {
        console.error('setMnemonic error~>', err)
    }

        // const contents = fs.readFileSync(AXONRC_PATH)
        // let parsed = toml.parse(contents.toString()) as any
        // parsed.node.EthereumBIP39Seed = mnemonic
        // var updated = tomlify.toToml(parsed, {
        //     space: 0,
        //     replace: function(key: string, value: any) {
        //         // prevent tomlify from turning integers into floats
        //         const context = this
        //         const keypath = tomlify.toKey(context.path)
        //         const integerFields = [
        //             'node.P2PListenPort',
        //             'node.MaxConcurrentPeers',
        //         ]
        //         if (integerFields.indexOf(keypath) > -1) {
        //             return value.toFixed(0)
        //         }
        //         return false
        //     },
        // })
        // fs.writeFileSync(AXONRC_PATH, updated)
    },

    async getMostRecentChangelogSeen() {
        let mostRecentChangelogSeen = (await UserData.get('mostRecentChangelogSeen')) as string|undefined
        return mostRecentChangelogSeen
    },

    async setMostRecentChangelogSeen(semver: string|undefined) {
        await UserData.set('mostRecentChangelogSeen', semver)
    },
}

export default UserData