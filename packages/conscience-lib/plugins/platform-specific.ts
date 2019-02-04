import { IPlugin } from './types'

var platformSpecificPlugins: IPlugin[] = []

function setPlatformSpecificPlugins(plugins: IPlugin[]) {
    console.log('setPlatformSpecificPlugins')
    platformSpecificPlugins = plugins
    // for (let p of plugins) {
    //     platformSpecificPlugins.push(p)
    // }
}

function getPlatformSpecificPlugins() {
    return platformSpecificPlugins
}

export {
    getPlatformSpecificPlugins,
    setPlatformSpecificPlugins,
}