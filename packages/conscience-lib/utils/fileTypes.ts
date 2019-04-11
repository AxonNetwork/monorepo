import path from 'path'
import flatMap from 'lodash/flatMap'
import { getPlugins, onPluginsReady } from '../plugins'
import { IFileType, IFileTypePlugin, IFileViewerPlugin, IFileEditorPlugin } from '../plugins/types'

export let filetypes: { [extension: string]: IFileType }
export let fileViewers: { [name: string]: IFileViewerPlugin }
export let fileEditors: { [name: string]: IFileEditorPlugin }

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
        fileViewers[plugin.name] = { ...plugin }
    }

    // register file editors from plugins
    const editorPlugins = getPlugins('file editor') as IFileEditorPlugin[]
    fileEditors = {}
    for (let plugin of editorPlugins) {
        fileEditors[plugin.name] = { ...plugin }
    }
})


// Get the normalized extension for the given filename
export function ext(filename: string) {
    return path.extname(filename || '').toLowerCase().substring(1)
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


