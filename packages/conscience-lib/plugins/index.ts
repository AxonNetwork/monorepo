
export type PluginType = 'file type' | 'file viewer'

export interface IFileType {
    extensions: string[]
    isTextFile: boolean
    viewers: string[]
    editors: string[]
}

export interface IFileTypePlugin {
    pluginType: 'file type'
    fileTypes: IFileType[]
}

export interface IFileViewerPlugin {
    pluginType: 'file viewer'
    name: string
    viewer: IViewerComponent
}

export type IViewerComponent = React.Component<{
    repoID: string
    directEmbedPrefix: string
    filename: string
    fileContents?: string
}>

export type IPlugin = IFileTypePlugin | IFileViewerPlugin


const pluginRegistry = function() {
    // Load all default plugins
    const defaultPlugins = [
        require('./defaults/filetype.defaults.ts').default,
        require('./defaults/viewer.img.tsx').default,
        require('./defaults/viewer.code.tsx').default,
        require('./defaults/viewer.data.tsx').default,
        require('./defaults/viewer.markdown.tsx').default,
    ] as IPlugin[]

    // Load user plugins (@@TODO)
    const userPlugins = [] as IPlugin[]

    const plugins = [...defaultPlugins, ...userPlugins]

    const registry = {
        'file type':   [] as IFileTypePlugin[],
        'file viewer': [] as IFileViewerPlugin[],
    }

    for (let plugin of plugins) {
        switch (plugin.pluginType) {
        case 'file type':
        case 'file viewer':
            registry[plugin.pluginType].push(plugin)
            break
        default:
            console.error('Unknown plugin type:', plugin.pluginType)
        }
    }

    return registry
}()

export function getPlugins(pluginType: PluginType) {
    return pluginRegistry[pluginType]
}