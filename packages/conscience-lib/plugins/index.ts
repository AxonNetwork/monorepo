import {
    IPlugin,
    IFileTypePlugin,
    IFileViewerPlugin,
    IFileEditorPlugin,
    IMarkdownShortcodePlugin,
    PluginType,
} from './types'
import { getPlatformSpecificPlugins } from './platform-specific'

let pluginRegistry: {
    'file type': IFileTypePlugin[],
    'file viewer': IFileViewerPlugin[],
    'file editor': IFileEditorPlugin[],
    'markdown shortcode': IMarkdownShortcodePlugin[],
}

let pluginsReady = false
let pluginsReadyCallbacks = [] as (() => void)[]
export function onPluginsReady(fn: () => void) {
    if (pluginsReady) {
        return fn()
    }
    pluginsReadyCallbacks.push(fn)
}


export function initPlugins() {
    // Load all default plugins
    const defaultPlugins = [
        require('./defaults/filetype.defaults.tsx').default,
        require('./defaults/viewer.img.tsx').default,
        require('./defaults/viewer.code.tsx').default,
        require('./defaults/viewer.data.tsx').default,
        require('./defaults/viewer.data-spreadsheet.tsx').default,
        require('./defaults/viewer.markdown.tsx').default,
        require('./defaults/editor.data-spreadsheet.tsx').default,
        require('./defaults/editor.markdown.tsx').default,
        require('./defaults/editor.kanban.tsx').default,
        require('./defaults/shortcode.mathjax.tsx').default,
    ] as IPlugin[]

    // Load platform-specific plugins
    const platformPlugins = getPlatformSpecificPlugins()

    // Load user plugins (@@TODO)
    const userPlugins = [] as IPlugin[]

    const plugins = [...defaultPlugins, ...platformPlugins, ...userPlugins]

    pluginRegistry = {
        'file type': [] as IFileTypePlugin[],
        'file viewer': [] as IFileViewerPlugin[],
        'file editor': [] as IFileEditorPlugin[],
        'markdown shortcode': [] as IMarkdownShortcodePlugin[],
    }

    for (let plugin of plugins) {
        switch (plugin.pluginType) {
            case 'file type':
                pluginRegistry[plugin.pluginType].push(plugin as IFileTypePlugin)
                break
            case 'file viewer':
                pluginRegistry[plugin.pluginType].push(plugin as IFileViewerPlugin)
                break
            case 'file editor':
                pluginRegistry[plugin.pluginType].push(plugin as IFileEditorPlugin)
                break
            case 'markdown shortcode':
                pluginRegistry[plugin.pluginType].push(plugin as IMarkdownShortcodePlugin)
                break
            default:
                console.error('Unknown plugin type:', (plugin as any).pluginType)
                break
        }
    }

    pluginsReady = true
    for (let cb of pluginsReadyCallbacks) {
        cb()
    }
}

export function getPlugins(pluginType: PluginType) {
    return pluginRegistry[pluginType]
}
