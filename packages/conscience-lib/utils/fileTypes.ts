import path from 'path'
import flatMap from 'lodash/flatMap'
import { getPlugins, onPluginsReady } from '../plugins'
import { IFileType, FileViewerComponent, IFileTypePlugin, IFileViewerPlugin, FileEditorComponent, IFileEditorPlugin } from '../plugins/types'

export let filetypes: {[extension: string]: IFileType}
export let fileViewers: { [name: string]: { humanName: string, name: string, viewer: FileViewerComponent, widthMode: 'full' | 'breakpoints' | 'unset' } }
export let fileEditors: { [name: string]: { humanName: string, name: string, editor: FileEditorComponent } }

onPluginsReady(() => {
    // register file types from plugins
    const filetypePlugins = flatMap((getPlugins('file type') as IFileTypePlugin[]).map(plugin => plugin.fileTypes))

    filetypes = {} as { [extension: string]: IFileType }
    for (let filetype of filetypePlugins) {
        for (let ext of filetype.extensions) {
            filetypes[ext] = filetype
        }
    }

    // register file viewers from plugins
    const viewerPlugins = getPlugins('file viewer') as IFileViewerPlugin[]
    fileViewers = {}
    for (let plugin of viewerPlugins) {
        fileViewers[plugin.name] = {
            viewer: plugin.viewer,
            name: plugin.name,
            humanName: plugin.humanName,
            widthMode: plugin.widthMode,
        }
    }

    // register file editors from plugins
    const editorPlugins = getPlugins('file editor') as IFileEditorPlugin[]
    fileEditors = {}
    for (let plugin of editorPlugins) {
        fileEditors[plugin.name] = {
            editor: plugin.editor,
            name: plugin.name,
            humanName: plugin.humanName,
        }
    }
})


// Get the normalized extension for the given filename
export function ext(filename: string) {
    return path.extname(filename).toLowerCase().substring(1)
}

export function getType(filename: string) {
    return (filetypes[ext(filename)] || {}).type || 'unknown'
}

export function isTextFile(filename: string) {
    return (filetypes[ext(filename)] || {}).isTextFile || false
}

export function getViewers(filename: string) {
    return ((filetypes[ext(filename)] || {}).viewers || []).map(viewerName => fileViewers[viewerName]).filter(x => x !== undefined)
}

export function getEditors(filename: string) {
    return ((filetypes[ext(filename)] || {}).editors || []).map(editorName => fileEditors[editorName]).filter(x => x !== undefined)
}

export function getIcon(filename: string) {
    return (filetypes[ext(filename)] || {}).iconComponent
}

export function getLanguage(filename: string) {
    const extension = ext(filename)
    const filetype = filetypes[extension] || {}
    if (filetype.type === 'code') {
        return filetype.language || extension
    }
    return extension
}


