import { IPlugin } from './types'

var platformSpecificPlugins: IPlugin[] = []

function setPlatformSpecificPlugins(plugins: IPlugin[]) {
    platformSpecificPlugins = plugins
}

function getPlatformSpecificPlugins() {
    return platformSpecificPlugins
}

export {
    getPlatformSpecificPlugins,
    setPlatformSpecificPlugins,
}