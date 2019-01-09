import path from 'path'
import { flatMap } from 'lodash'
import { getPlugins, IFileType, IViewerComponent, IFileViewerPlugin } from '../plugins'

export const filetypes = function() {
    const filetypes = flatMap( getPlugins('file type').map(plugin => plugin.fileTypes) )

    const types = {} as {[extension: string]: IFileType}
    for (let filetype of filetypes) {
        for (let ext of filetype.extensions) {
            types[ext] = filetype
        }
    }
    return types
}()

export const fileViewers = function() {
    const plugins = getPlugins('file viewer') as IFileViewerPlugin[]

    const viewers: {[name: string]: IViewerComponent} = {}
    for (let plugin of plugins) {
        viewers[plugin.name] = plugin.viewer
    }
    return viewers
}()

// Get the normalized extension for the given filename
export function ext(filename: string) {
    return path.extname(filename).toLowerCase().substring(1)
}

// @@TODO: filetype standardization
export function fileType(filename: string) {
    const extension = ext(filename)
    if (filetypes[extension] !== undefined) {
        return filetypes[extension].type
    } else {
        return 'unknown'
    }
}

export function isTextFile(filename: string) {
    const extension = ext(filename)
    return (filetypes[extension] || {}).isTextFile || false
}

export function getViewers(filename: string) {
    console.log('xyzzy', filetypes[ext(filename)])
    return ((filetypes[ext(filename)] || {}).viewers || []).map(viewerName => fileViewers[viewerName]).filter(x => x !== undefined)
}

export function getLanguage(filename: string) {
    const extension = ext(filename)
    const filetype = filetypes[extension] || {}
    if (filetype.type === 'code') {
        return filetype.language || extension
    }
    return extension
}


