export type PluginType = 'file type' | 'file viewer' | 'file editor'

export interface IFileType {
    extensions: string[]
    type: string
    language?: string
    isTextFile: boolean
    viewers: string[]
    editors: string[]
    iconComponent: React.ComponentType<{}>
}

export interface IFileTypePlugin {
    pluginType: 'file type'
    fileTypes: IFileType[]
}

export interface IFileViewerPlugin {
    pluginType: 'file viewer'
    name: string
    humanName: string
    viewer: FileViewerComponent
}

export type FileViewerComponent = React.ComponentClass<{
    repoID: string
    directEmbedPrefix: string
    filename: string
    fileContents?: string
}>

export interface IFileEditorPlugin {
    pluginType: 'file editor'
    name: string
    humanName: string
    editor: FileEditorComponent
}

export type FileEditorComponent = React.ComponentClass<{
    repoID: string
    directEmbedPrefix: string
    filename: string
    fileContents?: string
}>

export type IPlugin = IFileTypePlugin | IFileViewerPlugin | IFileEditorPlugin

const pluginRegistry = (function() {
    // Load all default plugins
    const defaultPlugins = [
        require('./defaults/filetype.defaults.tsx').default,
        require('./defaults/viewer.img.tsx').default,
        require('./defaults/viewer.code.tsx').default,
        require('./defaults/viewer.data.tsx').default,
        require('./defaults/viewer.embed.tsx').default,
        require('./defaults/viewer.markdown.tsx').default,
    ] as IPlugin[]

    // Load user plugins (@@TODO)
    const userPlugins = [] as IPlugin[]

    const plugins = [...defaultPlugins, ...userPlugins]

    const registry = {
        'file type': [] as IFileTypePlugin[],
        'file viewer': [] as IFileViewerPlugin[],
        'file editor': [] as IFileEditorPlugin[],
    }

    for (let plugin of plugins) {
        switch (plugin.pluginType) {
            case 'file type':
                registry[plugin.pluginType].push(plugin as IFileTypePlugin)
                break
            case 'file viewer':
                registry[plugin.pluginType].push(plugin as IFileViewerPlugin)
                break
            case 'file editor':
                registry[plugin.pluginType].push(plugin as IFileEditorPlugin)
                break
            default:
                console.error(
                    'Unknown plugin type:',
                    (plugin as any).pluginType
                )
        }
    }

    return registry
})()

export function getPlugins(pluginType: PluginType) {
    return pluginRegistry[pluginType]
}
