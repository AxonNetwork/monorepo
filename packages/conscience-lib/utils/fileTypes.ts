import path from 'path'
import flatMap from 'lodash/flatMap'
import { getPlugins, IFileType, FileViewerComponent, IFileTypePlugin, IFileViewerPlugin, FileEditorComponent, IFileEditorPlugin } from '../plugins'

export const filetypes = function() {
    const filetypes = flatMap((getPlugins('file type') as IFileTypePlugin[]).map(plugin => plugin.fileTypes))

    const types = {} as { [extension: string]: IFileType }
    for (let filetype of filetypes) {
        for (let ext of filetype.extensions) {
            types[ext] = filetype
        }
    }
    return types
}()

export const fileViewers = function() {
    const plugins = getPlugins('file viewer') as IFileViewerPlugin[]

    const viewers: { [name: string]: { humanName: string, name: string, viewer: FileViewerComponent } } = {}
    for (let plugin of plugins) {
        viewers[plugin.name] = {
            viewer: plugin.viewer,
            name: plugin.name,
            humanName: plugin.humanName,
        }
    }
    return viewers
}()

export const fileEditors = function() {
    const plugins = getPlugins('file editor') as IFileEditorPlugin[]

    const editors: { [name: string]: { humanName: string, name: string, editor: FileEditorComponent } } = {}
    for (let plugin of plugins) {
        editors[plugin.name] = {
            editor: plugin.editor,
            name: plugin.name,
            humanName: plugin.humanName,
        }
    }
    return editors
}()

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


